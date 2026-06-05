/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, ProjectItem, TestimonialItem, BlogPostItem } from "../types";

export const fallbackServices: ServiceItem[] = [
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
    image: "/images/figma_ui_ux_architecture_map_1780657851022.png"
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

export const fallbackProjects: ProjectItem[] = [
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
    image: "/images/apex_logistics_explainer_1780490862460.png",
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

export const fallbackTestimonials: TestimonialItem[] = [
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

export const fallbackBlogs: BlogPostItem[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Brand Identity in 2026",
    slug: "brand-identity-guide-2026",
    category: "Branding",
    summary: "Discover why physical materials and flat digital layouts are evolving into hyper-realistic, glassmorphic brand guides to engage modern, design-literate audiences.",
    content: "## The Visual Landscape is Changing\n\nTo survive in today's digital environment, brand identity can no longer be a static PDF manual hiding on a corporate drive. Winning brands are treating their visual presence in an organic, living context.\n\n### 1. Minimalist but Brave\n\nWe see high-contrast, bold display typography coupled with soft background gradients taking the crown. Standard blue blocks are obsolete. Modern design requires high-end contrast using crisp off-whites and dark cosmic slates.\n\n### 2. Micro-Interactions on the Web\n\nWhen someone hovers over an action element, they expect physical feedback. High-performing agencies understand how motion patterns guide user focus and build structural trust.",
    image: "/images/brand_identity_guide_1780658228928.png",
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
