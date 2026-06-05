/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Lead, Message, ServiceItem, ProjectItem, TestimonialItem, BlogPostItem } from "../types";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc
} from "firebase/firestore";

export function getAuthToken(): string | null {
  return localStorage.getItem("jaytech_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("jaytech_token", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("jaytech_token");
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("jaytech_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem("jaytech_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("jaytech_user");
  }
}

// Config headers
function getHeaders(contentType = "application/json"): HeadersInit {
  const headers: HeadersInit = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchServerData(): Promise<{
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  blogs: BlogPostItem[];
}> {
  const res = await fetch("/api/data");
  if (!res.ok) throw new Error("Failed to load creative assets data from server.");
  return res.json();
}

// Service actions
export const api = {
  // Authentication
  async loginWithGoogle(): Promise<{ token: string; user: User }> {
    try {
      const provider = new GoogleAuthProvider();
      // Ask for profile/email scopes
      provider.addScope("profile");
      provider.addScope("email");
      
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      
      // Let's check if the user profile already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", uid));
      let syncedUser: User;
      
      if (!userDoc.exists()) {
        syncedUser = {
          id: uid,
          name: result.user.displayName || "Google User",
          email: result.user.email || "",
          phone: result.user.phoneNumber || "",
          isAdmin: result.user.email?.toLowerCase() === "aggreyjavan46@gmail.com",
          avatar: result.user.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          createdAt: new Date().toISOString()
        };
        // Persist the user profile document in Firestore
        await setDoc(doc(db, "users", uid), syncedUser);
      } else {
        const userData = userDoc.data();
        syncedUser = {
          id: uid,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          isAdmin: userData.isAdmin || false,
          avatar: userData.avatar || "",
          createdAt: userData.createdAt
        };
      }
      
      setAuthToken(uid);
      setCurrentUser(syncedUser);
      return { token: uid, user: syncedUser };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.GET, `users`);
    }
  },

  async login(credentials: any): Promise<{ token: string; user: User }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const uid = userCredential.user.uid;
      
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        throw new Error("No user profile exists for this account in Firestore database.");
      }
      
      const userData = userDoc.data();
      const user: User = {
        id: uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        isAdmin: userData.isAdmin || false,
        avatar: userData.avatar || "",
        createdAt: userData.createdAt
      };
      
      setAuthToken(uid);
      setCurrentUser(user);
      return { token: uid, user };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.GET, `users`);
    }
  },

  async register(registration: any): Promise<{ token: string; user: User }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registration.email, registration.password);
      const uid = userCredential.user.uid;
      
      const user: User = {
        id: uid,
        name: registration.name,
        email: registration.email,
        phone: registration.phone || "",
        isAdmin: registration.email.toLowerCase() === "aggreyjavan46@gmail.com",
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", uid), user);
      
      setAuthToken(uid);
      setCurrentUser(user);
      return { token: uid, user };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.CREATE, `users`);
    }
  },

  async getProfile(): Promise<{ user: User }> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("No active authenticated session on current client.");
      }
      const uid = firebaseUser.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        throw new Error("Profile not found in database.");
      }
      const userData = userDoc.data();
      const user: User = {
        id: uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        isAdmin: userData.isAdmin || false,
        avatar: userData.avatar || "",
        createdAt: userData.createdAt
      };
      setCurrentUser(user);
      return { user };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.GET, `users`);
    }
  },

  async updateProfile(updates: any): Promise<{ user: User }> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("No active authenticated session on current client.");
      }
      const uid = firebaseUser.uid;
      const ref = doc(db, "users", uid);
      await updateDoc(ref, {
        name: updates.name,
        phone: updates.phone || "",
        avatar: updates.avatar || ""
      });
      
      const userDoc = await getDoc(ref);
      const userData = userDoc.data()!;
      const user: User = {
        id: uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        isAdmin: userData.isAdmin || false,
        avatar: userData.avatar || "",
        createdAt: userData.createdAt
      };
      setCurrentUser(user);
      return { user };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.UPDATE, `users`);
    }
  },

  // Leads
  async submitLead(leadData: { name: string; email: string; phone: string; businessName: string }): Promise<{ message: string; lead: Lead }> {
    try {
      const leadId = "lead_" + Math.random().toString(36).substring(2, 11);
      const lead: Lead = {
        id: leadId,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        businessName: leadData.businessName,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "leads", leadId), lead);
      return { message: "Consultation booked successfully. Our strategist will call you shortly.", lead };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.WRITE, `leads`);
    }
  },

  // Interactive AI Brand Audit
  async generateAudit(auditData: {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    brandUrl?: string;
    industry: string;
    goals: string;
    audience: string;
  }): Promise<{ message: string; audit: string; lead: Lead }> {
    const res = await fetch("/api/leads/audit", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(auditData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Free brand audit generation service failed.");
    return data;
  },

  // Messages
  async submitMessage(msgData: { name: string; email: string; subject: string; message: string }): Promise<{ message: string }> {
    try {
      const msgId = "msg_" + Math.random().toString(36).substring(2, 11);
      const newMessage: Message = {
        id: msgId,
        name: msgData.name,
        email: msgData.email,
        subject: msgData.subject,
        message: msgData.message,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "messages", msgId), newMessage);
      return { message: "Your message has been stored in our backend pipeline. Thank you!" };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.WRITE, `messages`);
    }
  },

  // Newsletter Subscriptions
  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    try {
      const subId = "sub_" + Math.random().toString(36).substring(2, 11);
      const newSubscription = {
        id: subId,
        email,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "subscriptions", subId), newSubscription);
      return { message: "Success! You have subscribed to our visual intelligence newsletter." };
    } catch (err: any) {
      return handleFirestoreError(err, OperationType.WRITE, `subscriptions`);
    }
  },

  // Administration dashboard actions (Requires JWT)
  async getAdminMetrics(): Promise<{
    totalLeads: number;
    totalMessages: number;
    recentLeads: any[];
    recentMessages: any[];
    metrics: {
      conversionRate: string;
      averageAuditScore: number;
      inquiriesThisWeek: number;
    };
  }> {
    const res = await fetch("/api/admin/metrics", {
      method: "GET",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Forbidden: Administration credentials required.");
    return data;
  }
};
