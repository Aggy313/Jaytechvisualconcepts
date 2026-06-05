/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ArrowUpRight, ShieldCheck, Mail, Phone, Zap, Instagram, Facebook, Music } from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Blog from "./components/Blog";
import LeadGen from "./components/LeadGen";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import ExitIntentPopup from "./components/ExitIntentPopup";
import FloatingCTA from "./components/FloatingCTA";
import Logo from "./components/Logo";
import NewsletterSubscribe from "./components/NewsletterSubscribe";

// Static API helper
import { fetchServerData, getCurrentUser, removeAuthToken, setCurrentUser } from "./lib/api";
import { User, ServiceItem, ProjectItem, TestimonialItem, BlogPostItem } from "./types";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { fallbackServices, fallbackProjects, fallbackTestimonials, fallbackBlogs } from "./lib/staticData";

export default function App() {
  // Global Database state
  const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(fallbackTestimonials);
  const [blogs, setBlogs] = useState<BlogPostItem[]>(fallbackBlogs);

  // Auth User state
  const [user, setUser] = useState<User | null>(null);

  // Layout View Toggles
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean; view: "login" | "register" }>({
    isOpen: false,
    view: "login"
  });
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

// Fetch essential studio files from server on launch and setup Firebase sync
  useEffect(() => {
    // Sync current session from local cache first
    setUser(getCurrentUser());

    const loadData = async () => {
      try {
        const payload = await fetchServerData();
        setServices(payload.services || []);
        setProjects(payload.projects || []);
        setTestimonials(payload.testimonials || []);
        setBlogs(payload.blogs || []);
      } catch (err) {
        console.error("Critical: Failed to sync initial dynamic layouts from database server.", err);
      }
    };
    loadData();

    // Setup active Firebase Auth observer
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const syncedUser: User = {
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              phone: userData.phone || "",
              avatar: userData.avatar || "",
              isAdmin: userData.isAdmin || false,
              createdAt: userData.createdAt
            };
            setUser(syncedUser);
            setCurrentUser(syncedUser);
          } else {
            // Profile doc might not exist yet if register is in progress
            const cached = getCurrentUser();
            if (cached && cached.id === firebaseUser.uid) {
              setUser(cached);
            }
          }
        } catch (e) {
          console.error("Failed to sync profile from Firestore:", e);
        }
      } else {
        setUser(null);
        setCurrentUser(null);
        removeAuthToken();
      }
    });

    return () => unsubscribe();
  }, []);

  // Monitor scrolling to highlight correct navbar active state
  useEffect(() => {
    const handleScrollMonitor = () => {
      const sections = ["home", "about", "services", "portfolio", "blog", "audit", "contact"];
      const scrollPosition = window.scrollY + 160;

      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sect);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollMonitor);
    return () => window.removeEventListener("scroll", handleScrollMonitor);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setDashboardOpen(false);
    
    // Use setTimeout to allow the React state to update and render the landing sections
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navbarHeight = 84; // Navbar height + breathing room
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        setActiveSection(sectionId);
      }
    }, 120);
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setDashboardOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase signOut failed:", e);
    }
    removeAuthToken();
    setCurrentUser(null);
    setUser(null);
    setDashboardOpen(false);
  };

  const triggerAuditFromModal = () => {
    handleNavigate("audit");
  };

  const handleBookService = (serviceTitle: string) => {
    const contactMessageTextarea = document.getElementsByName("message")[0] as HTMLTextAreaElement;
    if (contactMessageTextarea) {
      contactMessageTextarea.value = `I'm highly interested in starting a customized project mapping our "${serviceTitle}" roadmap parameters with JayTech. Please schedule our consultation.`;
    }
    handleNavigate("contact");
  };

  return (
    <div className="bg-[#FAFBFD] text-slate-900 min-h-screen font-sans selection:bg-[#2563EB] selection:text-white antialiased overflow-x-hidden">
      {/* 1. GLOBAL LAYOUT FRAMEWORKS */}
      <Navbar
        currentUser={user}
        onOpenAuth={(view) => setAuthModalConfig({ isOpen: true, view })}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      {/* Dynamic View Control Overlay (Dashboard Portal) */}
      {dashboardOpen && user ? (
        <Dashboard
          currentUser={user}
          onLogout={handleLogout}
          onClose={() => setDashboardOpen(false)}
          onNavigateToAudit={triggerAuditFromModal}
        />
      ) : (
        <>
          {/* Main landing sections scrolling flow */}
          <main>
            <Hero onNavigate={handleNavigate} onOpenAuth={(view) => setAuthModalConfig({ isOpen: true, view })} />
            <About />
            <Services services={services} onBookService={handleBookService} />
            <Portfolio projects={projects} />
            <Testimonials testimonials={testimonials} />
            <Blog blogs={blogs} />
            <LeadGen />
            <FAQ />
            <Contact />
          </main>

          {/* 2. FOOTER COMPONENT */}
          <footer className="bg-[#0B2545] border-t border-blue-900/40 py-16 text-left relative overflow-hidden text-slate-100">
            <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[90px]" />
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 font-medium relative z-10">
              {/* Coll 1: Brand details footer statement */}
              <div className="space-y-4">
                <Logo iconSize="w-8 h-8" />
                <p className="text-slate-300 text-xs leading-relaxed max-w-xs font-normal">
                  Turning Ideas Into Visual Power through pixel-perfect identity blueprints, fast custom codebases, and brand strategy optimization.
                </p>
                <div className="flex items-center space-x-2.5 pt-1">
                  <a
                    href="https://instagram.com/jaytechvisualconcepts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-[#E1306C] rounded-lg transition-all duration-200 cursor-pointer"
                    title="Follow on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://tiktok.com/@jaytechvisualconcepts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                    title="Follow on TikTok"
                  >
                    <Music className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com/jaytechvisualconcepts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-[#1877F2] rounded-lg transition-all duration-200 cursor-pointer"
                    title="Follow on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  © 2026 JayTech Visual Concepts. All rights reserved.
                </div>
              </div>

              {/* Coll 2: Quick Links */}
              <div>
                <h4 className="text-white text-xs uppercase font-mono font-bold tracking-widest mb-4">
                  Explore Agency
                </h4>
                <ul className="space-y-2 text-xs font-normal">
                  <li>
                    <button onClick={() => handleNavigate("home")} className="text-slate-300 hover:text-[#06B6D4] cursor-pointer">
                      Home Intro
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("about")} className="text-slate-300 hover:text-[#06B6D4] cursor-pointer">
                      Agency Story
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("services")} className="text-slate-300 hover:text-[#06B6D4] cursor-pointer">
                      Unmistakable Capabilities
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("portfolio")} className="text-slate-300 hover:text-[#06B6D4] cursor-pointer">
                      Case Studies
                    </button>
                  </li>
                </ul>
              </div>

              {/* Coll 3: Technical parameters summary */}
              <div>
                <h4 className="text-white text-xs uppercase font-mono font-bold tracking-widest mb-4">
                  Strategic Channels
                </h4>
                <ul className="space-y-2 text-xs font-normal">
                  <li>
                    <button onClick={() => handleNavigate("blog")} className="text-slate-300 hover:text-blue-400 cursor-pointer">
                      Intelligence Insights
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("audit")} className="text-slate-300 hover:text-blue-400 cursor-pointer">
                      Generate Brand Audit
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setAuthModalConfig({ isOpen: true, view: "register" })} className="text-slate-300 hover:text-blue-400 cursor-pointer">
                      Subscribers Key Cabinet
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("contact")} className="text-slate-300 hover:text-blue-400 cursor-pointer">
                      Support Hotlines
                    </button>
                  </li>
                </ul>
              </div>

              {/* Coll 4: Newsletter subscribe channel & System health */}
              <div className="space-y-6">
                <NewsletterSubscribe />
                
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <h5 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">System Parameters</h5>
                  <div className="space-y-1.5 text-[10px] font-mono leading-none">
                    <div className="flex items-center justify-between pb-1 max-w-[200px]">
                      <span className="text-slate-400">SPEED RANK:</span>
                      <span className="text-emerald-400 font-bold">99/100</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 max-w-[200px]">
                      <span className="text-slate-400">DB TRANSPORTS:</span>
                      <span className="text-[#06B6D4] font-bold">FIRESTORE-SDK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* 3. CONVERSION / MARKETING MARKETING OVERLAYS */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })}
        onAuthSuccess={handleAuthSuccess}
        initialView={authModalConfig.view}
      />

      <ExitIntentPopup onTriggerAudit={triggerAuditFromModal} />

      <FloatingCTA />
    </div>
  );
}
