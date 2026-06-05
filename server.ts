/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve generated images statically under /src/assets/images/
app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));

// Initialize server-side Firebase & Firestore
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseAppInstance: any = null;
let firestoreDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    firebaseAppInstance = initializeApp(config);
    firestoreDb = getFirestore(firebaseAppInstance, config.firestoreDatabaseId);
    console.log("[JayTech Server] Firebase and Firestore loaded successfully.");
  } catch (err) {
    console.error("Failed to initialize Firebase on server:", err);
  }
}

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Database State Files
const DB_DIR = path.join(process.cwd(), "db");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const USERS_FILE = path.join(DB_DIR, "users.json");
const LEADS_FILE = path.join(DB_DIR, "leads.json");
const MESSAGES_FILE = path.join(DB_DIR, "messages.json");
const CONFIG_FILE = path.join(DB_DIR, "config.json");

// Helper to safely read files
function readJSONFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T;
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return defaultValue;
}

// Helper to safely write files
function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

// Load current DB nodes
let users = readJSONFile<any[]>(USERS_FILE, []);
let leads = readJSONFile<any[]>(LEADS_FILE, []);
let messages = readJSONFile<any[]>(MESSAGES_FILE, []);

// Authentication Utilities (Zero Dependency, Native Cryptography API)
const JWT_SECRET = process.env.JWT_SECRET || "jaytech_visual_concepts_master_key_998811";

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function signToken(payload: { id: string; email: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadStr = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payloadStr}`).digest("base64url");
  return `${header}.${payloadStr}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const [header, payloadStr, signature] = token.split(".");
    if (!header || !payloadStr || !signature) return null;
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payloadStr}`).digest("base64url");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Authentication Middleware
async function authenticateRequest(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access: Bearer token is missing." });
  }
  const token = authHeader.split(" ")[1];

  // 1. Try to verify as local JWT
  const decoded = verifyToken(token);
  if (decoded) {
    req.user = decoded;
    return next();
  }

  // 2. Try to verify as Firebase UID in Firestore
  if (firestoreDb) {
    try {
      const userDoc = await getDoc(doc(firestoreDb, "users", token));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        req.user = {
          id: token,
          email: userData.email,
          name: userData.name,
          isAdmin: userData.isAdmin || false
        };
        return next();
      }
    } catch (err) {
      console.error("Firestore user verification error:", err);
    }
  }

  // 3. Fallback to local custom user JSON verification
  users = readJSONFile<any[]>(USERS_FILE, []);
  const match = users.find((u) => u.id === token);
  if (match) {
    req.user = {
      id: match.id,
      email: match.email,
      name: match.name,
      isAdmin: match.isAdmin || false
    };
    return next();
  }

  return res.status(401).json({ error: "Unauthorized access: Invalid, missing or expired session." });
}

// Default Seed Data
const DEFAULT_SERVICES = [
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    tagline: "Corporate Brand Ecosystems",
    description: "We engineer elite digital style standards, color theory maps, and typography frameworks that position your enterprise at the peak of industry prestige and credibility.",
    benefits: [
      "Bespoke digital style blueprints engineered for market leadership",
      "High-performance colorspace mapping (RGB, CMYK, Digital Accents)",
      "Exquisite typographic hierarchy structures curated for pure legibility",
      "Prebuilt presentation systems and vector corporate asset templates"
    ],
    iconName: "Compass",
    priceStarting: "Ksh 24,000",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "logo-design",
    title: "Logo Design & Vector Craft",
    tagline: "High-Concept Brand Signatures",
    description: "Our designers craft geometrically perfect, memorable visual signatures that distill your entire market mission into a crisp, scalable vector emblem.",
    benefits: [
      "3 avant-garde layout proposals backed by conceptual design logic",
      "Precision mathematical grid alignment checking every curve",
      "Fully scalable vector master archives (.SVG, .AI, .EPS, .PDF)",
      "Optimized responsive iterations for mobile apps up to massive billboards"
    ],
    iconName: "PenTool",
    priceStarting: "Ksh 12,000",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Architecture & Figma Maps",
    tagline: "High-End Component Engineering",
    description: "We design flawless visual journeys and gorgeous wireframe screens rooted in digital psychology, sleek layout patterns, and conversion optimization rules.",
    benefits: [
      "A comprehensive pixel-perfect Figma design catalog with reusable elements",
      "Intuitive layout planning removing friction and maximizing sign-ups",
      "Complete native dark & light mode component configurations",
      "Developer-ready custom visual parameters and asset handoff guides"
    ],
    iconName: "Layers",
    priceStarting: "Ksh 35,000",
    image: "/src/assets/images/figma_ui_ux_architecture_map_1780657851022.png"
  },
  {
    id: "webs",
    title: "Web Design & Development",
    tagline: "Fast Full-Stack Frameworks",
    description: "We engineer blazing-fast, custom-coded web portals and interactive landing pages coded in modern React and Tailwind, delivering flawless rendering speeds.",
    benefits: [
      "Sub-second load times engineered with clean rendering architectures",
      "Seamless backend synchronizations with Firestore and custom secure APIs",
      "99/100 Core Web Vitals guarantees for dominant SEO performance",
      "Fluid layouts perfectly responsive from small touch displays up to 4K"
    ],
    iconName: "Code",
    priceStarting: "Ksh 60,000",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics & 3D Web Animations",
    tagline: "Cinematic Micro-Animations",
    description: "We create breathtaking, web-optimized kinetic animations and smooth interactive micro-transitions that capture user attention instantly and double dwell time.",
    benefits: [
      "Ultra-fluid web-ready animations configured with Lottie/JSON",
      "Gleaming 3D interactive graphics and fluid viewport interactions",
      "High-value visual pacing and custom intro logo signatures",
      "Finely balanced easings preventing motion lag or layout stutter"
    ],
    iconName: "Sparkles",
    priceStarting: "Ksh 25,000",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "video-editing",
    title: "Premium Video Craft & Viral Reels",
    tagline: "High-Impact Cinematic Edits",
    description: "We deliver professional-grade grading, soundscapes, and rapid hook pacing to turn raw footage into high-yield commercials and viral reels that drive clicks.",
    benefits: [
      "Hollywood-caliber color grading and tonal balancing in DaVinci Resolve",
      "Bespoke ambient sound design and sound effects placement",
      "Retention-optimized sequencing to capture short audience windows",
      "Sophisticated typographic captions utilizing elegant modern fonts"
    ],
    iconName: "Video",
    priceStarting: "Ksh 18,000",
    image: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "Aura Skincare Rebrand",
    category: "Branding",
    description: "An elegant, minimalist, and luxury rebrand for a natural skincare line. Overhauling their packaging design, color palette, and digital presence.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80",
    challenge: "The brand struggled with visual noise, blending in with standard pharmaceutical aesthetics and losing high-end premium clientele.",
    solution: "We reduced visual bloat, designing custom typography combined with cream hues and soft organic glassmorphism concepts.",
    results: "+180% premium customer retention, 45% increase in e-commerce average order size within three months."
  },
  {
    id: "2",
    title: "Lumina Tech Interface",
    category: "Websites",
    description: "Next-generation SaaS platform interface structure. Complete design overhaul of the analytics suite, responsive dashboards, and interactive widgets.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    challenge: "Complex structural charting was cluttered, inducing high user friction and leading to drop-offs on product trials.",
    solution: "Coded a high-contrast dark visual system using customizable sidebar widgets and responsive cards modeled around iOS design.",
    results: "User cognitive load decreased by 35%, conversion rates on subscription renewals increased by 14%."
  },
  {
    id: "3",
    title: "Nova Watches Commercials",
    category: "Videography",
    description: "Cinematic promotional edits and motion asset library for a premium Scandinavian smartwatch brand.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    challenge: "Raw device videos lacked emotional resonance, failing to convey the absolute craft and pricing value of the smart device.",
    solution: "Created 3D motion transitions, added DaVinci cinematic grading with heavy gold/charcoal shadows, and custom ambient tempo soundtracks.",
    results: "Over 2.4 million organic views across social loops, generating a 50% increase in referral orders."
  },
  {
    id: "4",
    title: "Vortex Gaming Visual Identity",
    category: "Logos",
    description: "Bespoke high-contrast dynamic mark inspired by celestial storms and esports culture.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    challenge: "The prior logo looked dated, rendering poorly on dark streams and micro mobile screens.",
    solution: "Created an absolute vector emblem leveraging negative space geometry, resulting in an icon that remains hyper-readable even at 16px.",
    results: "+220% digital branding recognition rating among game streamers."
  },
  {
    id: "5",
    title: "Urban Lifestyle Campaign",
    category: "Photography",
    description: "High-end urban fashion lifestyle campaign captured for an sustainable clothing giant.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    challenge: "Standard stock look felt artificial, disconnective, and didn't appeal to eco-conscious GenZ demographic.",
    solution: "Executed street photography leveraging natural lighting with cinematic film grains matching film editor qualities.",
    results: "98% positive branding feedback scores; click rate on the collections list rocketed by 30%."
  },
  {
    id: "6",
    title: "Apex Logistics Explainer",
    category: "Motion Graphics",
    description: "Highly engaging kinetic infographic detailing supply-chain routes and technical telemetry statistics.",
    image: "/src/assets/images/apex_logistics_explainer_1780490862460.png",
    challenge: "B2B customers didn't understand the proprietary logistics tech, extending sales pipeline cycles.",
    solution: "Designed a pristine, 2-minute motion explainer using clean linear colors, smooth easing curves, and animated maps.",
    results: "Reduced corporate sales cycle times by an average of 18 days due to instant clarity."
  },
  {
    id: "7",
    title: "Elysian Estate Branding",
    category: "Branding",
    description: "Elite visual guidelines, gold foil brochures, and virtual video tour for a billion-dollar ocean villa development in Ibiza.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    challenge: "The properties were represented as simple structural blueprints, delaying off-plan sales bookings.",
    solution: "Drafted a grand physical style guide combining custom metallic color assets and cinematic flythroughs.",
    results: "75% of active Ibiza plots sold out within 6 weeks of digital launching campaigns."
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "1",
    name: "Mwangi Kamau",
    business: "Founder, Safari Tech Hub",
    rating: 5,
    review: "JayTech Visual Concepts transformed our entire outlook. Their branding and graphic delivery felt incredibly premium yet completely pocket-friendly for our growing startup. They delivered visual standards that exceeded our vision.",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "2",
    name: "Amina Omondi",
    business: "Director, Haba Organic Skincare",
    rating: 5,
    review: "The vector logo and modern social media designs they crafted have become our chief competitive weapon. Every wholesale partner in Nairobi comments on our outstanding visual style. Absolutely premium creative team!",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "3",
    name: "Kiplagat Bett",
    business: "Creative Lead, Apex AgroMedia",
    rating: 5,
    review: "Their web design and development package is simply outstanding. Our new landing page has raised active sales inquiries by 45%. Their strategic insights on conversion design are truly world-class.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "4",
    name: "Nanjala Wafula",
    business: "Founder, Mara Design Atelier",
    rating: 5,
    review: "Working with JayTech was the best decision for our luxury fashion brand. They didn't just design a website; they captured the soul of our eco-friendly fabrics and delivered an interface that speaks directly to international buyers.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "5",
    name: "Otieno Onyango",
    business: "CEO, Victoria Logistics & Shipping",
    rating: 5,
    review: "The social media kits and brand system generated by JayTech brought unparalleled consistency to our B2B communication. Our corporate presentation templates now look world-class, translating directly to higher closed deals.",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "6",
    name: "Wanjiku Mutua",
    business: "Chief Director, Rift Coffee Growers Co.",
    rating: 5,
    review: "JayTech's packaging visual identity and web design completely revitalized our retail presentation. Our premium hand-picked coffee sales grew by 60% since the launch, especially on our direct-to-consumer online store.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
  }
];

const DEFAULT_BLOG_POSTS = [
  {
    id: "1",
    title: "The Ultimate Guide to Brand Identity in 2026",
    slug: "brand-identity-guide-2026",
    category: "Branding",
    summary: "Discover why physical materials and flat digital layouts are evolving into hyper-realistic, glassmorphic brand guides to engage modern, design-literate audiences.",
    content: "## The Visual Landscape is Changing\n\nTo survive in today's digital environment, brand identity can no longer be a static PDF manual hiding on a corporate drive. Winning brands are treating their visual presence in an organic, living context.\n\n### 1. Minimalist but Brave\n\nWe see high-contrast, bold display typography coupled with soft background gradients taking the crown. Standard blue blocks are obsolete. Modern design requires high-end contrast using crisp off-whites and dark cosmic slates.\n\n### 2. Micro-Interactions on the Web\n\nWhen someone hovers over an action element, they expect physical feedback. High-performing agencies understand how motion patterns guide user focus and build structural trust.",
    image: "/src/assets/images/brand_identity_guide_1780658228928.png",
    date: "May 24, 2026",
    author: "Jay Tech",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "CRO Strategy on Creative Agency Landing Pages",
    slug: "cro-landing-page-strategy",
    category: "Websites",
    summary: "How we maximized lead conversion on landing pages by 28% without altering the premium, high-contrast, minimalist aesthetic.",
    content: "## High Conversion Meets Premium Design\n\nHistorically, creative executives feared that implementing call-to-actions (CTAs) ruined visual cleanliness. We have proven that wrong.\n\n### The Sticky CTA Model\n\nBy leveraging floating, clean, white backdrop cards on scrolling blocks, we give users the absolute freedom to engage at the exact moment they feel inspired, raising brand audits by 30% without bothering their reading flow.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    date: "June 01, 2026",
    author: "Elena Vance",
    readTime: "4 min read"
  },
  {
    id: "3",
    title: "The Physics of Animation: Easing & User Experience",
    slug: "physics-of-animation-ux",
    category: "Motion Graphics",
    summary: "Why linear animations look amateurish and how our custom eased curves build intuitive, premium, Apple-like interfaces.",
    content: "## Natural Motion is Key\n\nLinear movement does not exist in nature. In order to build a high-fidelity interface, we must mimic real physics.\n\n### Easing Curves Breakdown\n\nBy tweaking CSS Cubics and Framer-Motion damping variables, we craft structural depth. When an overlay flows into view, its speed is damp-controlled, settling with a subtle organic bounce that screams digital sophistication.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    date: "April 18, 2026",
    author: "Jay Tech",
    readTime: "6 min read"
  }
];

// Load Default tables if files empty
if (users.length === 0) {
  // Add an admin user seed
  const salt = generateSalt();
  const hashedPassword = hashPassword("AdminPassword123!", salt);
  users.push({
    id: "user-admin",
    name: "Admin Executive",
    email: "admin@jaytech.global",
    phone: "+1 (555) 750-2026",
    passwordHash: hashedPassword,
    salt: salt,
    isAdmin: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString()
  });
  writeJSONFile(USERS_FILE, users);
}

// Ensure database elements exist on backend
const testLeads = readJSONFile<any[]>(LEADS_FILE, []);
if (testLeads.length === 0) {
  // Pre-seed some leads to represent activity
  leads.push({
    id: "lead-1",
    name: "Jonathan Finch",
    email: "finch@auraskincare.com",
    phone: "+1 (310) 993-4112",
    businessName: "Aura Skincare Ltd",
    auditResponse: "Aura Skincare Audit: Highly premium aesthetic required. Current score: 62/100.",
    status: "processed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  });
  writeJSONFile(LEADS_FILE, leads);
}

// REST APIs
app.get("/api/data", (req, res) => {
  res.json({
    services: DEFAULT_SERVICES,
    projects: DEFAULT_PROJECTS,
    testimonials: DEFAULT_TESTIMONIALS,
    blogs: DEFAULT_BLOG_POSTS
  });
});

// Authentication System
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  // Reload current state
  users = readJSONFile<any[]>(USERS_FILE, []);
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);

  const newUser = {
    id: "user_" + crypto.randomBytes(8).toString("hex"),
    name,
    email,
    phone,
    passwordHash,
    salt,
    isAdmin: false,
    avatar: `https://images.unsplash.com/photo-${crypto.randomInt(1500000000000, 1600000000000)}?auto=format&fit=crop&w=200&q=80`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJSONFile(USERS_FILE, users);

  const token = signToken({ id: newUser.id, email: newUser.email, name: newUser.name });
  const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, isAdmin: newUser.isAdmin, avatar: newUser.avatar, createdAt: newUser.createdAt };

  res.status(201).json({ message: "Registration successful", token, user: userResponse });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password." });
  }

  users = readJSONFile<any[]>(USERS_FILE, []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password credential." });
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password credential." });
  }

  const token = signToken({ id: user.id, email: user.email, name: user.name });
  const userResponse = { id: user.id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin, avatar: user.avatar, createdAt: user.createdAt };

  res.json({ message: "Login successful", token, user: userResponse });
});

app.get("/api/auth/profile", authenticateRequest, (req: any, res) => {
  users = readJSONFile<any[]>(USERS_FILE, []);
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User profile not found." });
  }

  const response = { id: user.id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin, avatar: user.avatar, createdAt: user.createdAt };
  res.json({ user: response });
});

app.post("/api/auth/profile/update", authenticateRequest, (req: any, res) => {
  const { name, phone, avatar } = req.body;

  users = readJSONFile<any[]>(USERS_FILE, []);
  const userIdx = users.findIndex((u) => u.id === req.user.id);
  if (userIdx === -1) {
    return res.status(404).json({ error: "User profile not found." });
  }

  if (name) users[userIdx].name = name;
  if (phone) users[userIdx].phone = phone;
  if (avatar) users[userIdx].avatar = avatar;

  writeJSONFile(USERS_FILE, users);

  const updatedUser = users[userIdx];
  const response = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, isAdmin: updatedUser.isAdmin, avatar: updatedUser.avatar, createdAt: updatedUser.createdAt };

  res.json({ message: "Profile updated successfully", user: response });
});

// Leads Collection API
app.post("/api/leads", (req, res) => {
  const { name, email, phone, businessName } = req.body;

  if (!name || !email || !phone || !businessName) {
    return res.status(400).json({ error: "All inquiry details (Name, Email, Phone, Business Name) are required." });
  }

  leads = readJSONFile<any[]>(LEADS_FILE, []);
  const newLead = {
    id: "lead_" + crypto.randomBytes(8).toString("hex"),
    name,
    email,
    phone,
    businessName,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  leads.push(newLead);
  writeJSONFile(LEADS_FILE, leads);

  res.status(201).json({ message: "Consultation booked successfully. Our strategist will call you shortly.", lead: newLead });
});

// Messages Contact Form API
app.post("/api/messages", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required to submit an inquiry." });
  }

  messages = readJSONFile<any[]>(MESSAGES_FILE, []);
  const newMessage = {
    id: "msg_" + crypto.randomBytes(8).toString("hex"),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  writeJSONFile(MESSAGES_FILE, messages);

  res.status(201).json({ message: "Your message has been stored in our backend pipeline. Thank you!", msg: newMessage });
});

// Interactive AI Brand Audit tool with Gemini
app.post("/api/leads/audit", async (req, res) => {
  const { name, email, phone, businessName, brandUrl, industry, goals, audience } = req.body;

  if (!name || !email || !phone || !businessName) {
    return res.status(400).json({ error: "Full Name, Email, Phone, and Business Name are required to generate an audit." });
  }

  let auditResponseText = "";

  if (ai) {
    try {
      const prompt = `
        You are the Chief Creative Officer and Conversion Rate Optimization (CRO) Lead of "JayTech Visual Concepts" digital agency.
        Generate a highly professional, visually evocative, and strategic "Free Brand Visual Audit" for this business.
        
        Business Profile:
        - Brand/Business Name: ${businessName}
        - Website URL / Brand Link: ${brandUrl || "Not Provided (Suggest general aesthetic improvements based on brand name)"}
        - Contact Person: ${name}
        - Industry: ${industry || "Creative Digital Space"}
        - Core Brand Goals: ${goals || "Unspecified - Looking to scale conversion & brand trust"}
        - Target Audience: ${audience || "General consumers wanting digital excellence"}
        
        Output Requirements (Provide structured markdown output):
        1. "THE DIAGNOSIS" - Critique their likely current visual challenges based on their industry (${industry}), goals, and website brand/URL identifier (${brandUrl || "not specified"}). Critique standard layout painpoints and highlight recommendations tailored to their brand concept.
        2. "JAYTECH STRATEGIC REDESIGN ROADMAP" - Recommending specific aesthetic changes across 3 service channels (e.g. Logo & Brand Identity, High-End Web Interface UI/UX, or Video Collateral pacing). Mention how JayTech Visual Concepts executes this with "Turning Ideas Into Visual Power". If a website/brand link was provided (${brandUrl}), directly mention how we can overhaul the interface layout, colorways, and content flow of that specific link or visual presence!
        3. "CONVERSION & CRO BENCHMARKS" - Concrete action steps to optimize average page speeds, trust badges, and CTA layouts to turn cold users into paying clients.
        4. "VISUAL POWER SCORE" - An elegant calculated mock rating from 0-100 indicating prior visual standing (e.g., 64/100) vs. projected landing speed with JayTech (e.g., 96/100).
        
        Make the tone elite, direct, deeply strategic, encouraging, and branding-smart. Do not mention that you are a language model. Speak from JayTech Visual Concepts' leadership perspective. Output absolute premium markdown layout. Keep total response around 450 words.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      auditResponseText = response.text || "Your Brand Audit is complete! Contact JayTech strategists directly to inspect details.";
    } catch (error) {
      console.error("Gemini API Error in brand audit:", error);
      auditResponseText = `### Structural Brand Audit Pre-Calculated Profile \n\n*Our Gemini AI API limits are temporarily queued. JayTech Strategists have pre-calculated your profile:*\n\n1. **Aesthetic Diagnostic**: 68/100. Key visual painpoints found in mobile-first navigation headers.\n2. **Strategy Action**: Standardize typography systems and deploy dynamic glassmorphic card elements for user segments.\n3. **Booking Advisory**: Recommended immediate consultation with our UI/UX Creative Lead.${brandUrl ? `\n\n*Target Site URL Reviewed:* [${brandUrl}](${brandUrl})` : ""}`;
    }
  } else {
    auditResponseText = `### Standard Brand Identity Health Check \n\n1. **Visual Score**: 65/100\n2. **Core Diagnostic**: Layout needs visual high-contrast borders and premium typography standardizing.\n3. **CTA recommendation**: Book a direct strategizing call to receive custom wireframes built manually by JayTech.${brandUrl ? `\n\n*Target Site URL Reviewed:* [${brandUrl}](${brandUrl})` : ""}`;
  }

  // Save as Lead in DB
  leads = readJSONFile<any[]>(LEADS_FILE, []);
  const newLead = {
    id: "lead_" + crypto.randomBytes(8).toString("hex"),
    name,
    email,
    phone,
    businessName,
    brandUrl: brandUrl || "",
    industry: industry || "General",
    goals: goals || "Scale Brand Value",
    audience: audience || "Unknown",
    auditResponse: auditResponseText,
    status: "processed",
    createdAt: new Date().toISOString()
  };

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "leads", newLead.id), newLead);
    } catch (fsErr) {
      console.error("Error writing lead to Firestore:", fsErr);
    }
  }

  leads.push(newLead);
  writeJSONFile(LEADS_FILE, leads);

  res.status(201).json({
    message: "AI Brand Audit generated successfully!",
    audit: auditResponseText,
    lead: newLead
  });
});

// Admin dashboard actions (Requires JWT)
app.get("/api/admin/metrics", authenticateRequest, async (req: any, res) => {
  // If the verified user is not an admin, deny access
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Administrative access required." });
  }

  let dbLeads: any[] = [];
  let dbMessages: any[] = [];
  let dbSubscriptions: any[] = [];

  // Query Firestore if active
  if (firestoreDb) {
    try {
      const dbLeadsSnap = await getDocs(collection(firestoreDb, "leads"));
      dbLeadsSnap.forEach((doc) => {
        dbLeads.push(doc.data());
      });

      const dbMsgSnap = await getDocs(collection(firestoreDb, "messages"));
      dbMsgSnap.forEach((doc) => {
        dbMessages.push(doc.data());
      });

      const dbSubSnap = await getDocs(collection(firestoreDb, "subscriptions"));
      dbSubSnap.forEach((doc) => {
        dbSubscriptions.push(doc.data());
      });
    } catch (fsErr) {
      console.error("Error reading metrics from Firestore:", fsErr);
    }
  }

  // Fallbacks
  if (dbLeads.length === 0) {
    dbLeads = readJSONFile<any[]>(LEADS_FILE, []);
  }
  if (dbMessages.length === 0) {
    dbMessages = readJSONFile<any[]>(MESSAGES_FILE, []);
  }

  // Sort: newest first
  dbLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  dbMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  dbSubscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    totalLeads: dbLeads.length,
    totalMessages: dbMessages.length,
    totalSubscriptions: dbSubscriptions.length,
    recentLeads: dbLeads.slice(0, 5),
    recentMessages: dbMessages.slice(0, 5),
    recentSubscriptions: dbSubscriptions,
    metrics: {
      conversionRate: "4.8%",
      averageAuditScore: 78,
      inquiriesThisWeek: dbLeads.length + dbMessages.length
    }
  });
});

// Vite Middleware & Static Delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JayTech Server] Active and listening on port ${PORT}`);
  });
}

startServer();
