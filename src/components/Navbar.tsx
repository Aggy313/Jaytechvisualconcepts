/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, User as UserIcon, ShieldAlert, LogOut, LayoutDashboard, Settings, Instagram, Facebook, Music } from "lucide-react";
import { User } from "../types";
import Logo from "./Logo";

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (view: "login" | "register") => void;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenDashboard: () => void;
}

export default function Navbar({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  activeSection,
  onOpenDashboard,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Portfolio", id: "portfolio" },
    { name: "Blog", id: "blog" },
    { name: "Brand Audit", id: "audit" },
    { name: "Contact", id: "contact" }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="nav_bar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-blue-100 py-3 shadow-md shadow-blue-500/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          id="logo_btn"
          onClick={() => handleLinkClick("home")}
          className="focus:outline-none cursor-pointer"
        >
          <Logo iconSize="w-9 h-9" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100/80 border border-slate-200/60 rounded-full p-1.5 backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                activeSection === link.id
                  ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25"
                  : "text-slate-600 hover:text-blue-600 hover:bg-[#2563EB]/5"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Action Button & Auth Profile */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Branded Social Media Links */}
          <div className="flex items-center space-x-0.5 bg-slate-100/80 border border-slate-200/60 rounded-full px-1.5 py-1 mr-1">
            <a
              href="https://instagram.com/jaytechvisualconcepts"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 px-1.5 text-slate-500 hover:text-[#E1306C] transition-colors cursor-pointer"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://tiktok.com/@jaytechvisualconcepts"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 px-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="TikTok"
            >
              <Music className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com/jaytechvisualconcepts"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 px-1.5 text-slate-500 hover:text-[#1877F2] transition-colors cursor-pointer"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>

          {currentUser ? (
            <div className="relative">
              <button
                id="profile_dropdown_trigger"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/60 hover:border-blue-200 transition px-3 py-1.5 rounded-full focus:outline-none cursor-pointer"
              >
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#2563EB]/20"
                />
                <span className="text-xs text-slate-800 max-w-[80px] truncate font-medium">{currentUser.name}</span>
                {currentUser.isAdmin && (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-xl py-2 shadow-xl z-20"
                    >
                      <button
                        onClick={() => {
                          onOpenDashboard();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/50 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
                        <span>Home Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLinkClick("audit");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-[#06B6D4] hover:bg-blue-50/50 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#06B6D4]" />
                        <span>Run Brand Audit</span>
                      </button>
                      <hr className="border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:text-rose-500 hover:bg-rose-50 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                id="login_action"
                onClick={() => onOpenAuth("login")}
                className="text-slate-700 text-xs font-semibold hover:text-[#2563EB] transition px-3 py-1.5 uppercase tracking-wider cursor-pointer"
              >
                Login
              </button>
              <button
                id="cta_nav_btn"
                onClick={() => onOpenAuth("register")}
                className="bg-[#2563EB] hover:bg-blue-700 transition-colors text-white text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1 group shadow-lg shadow-[#2563EB]/25 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Icon */}
        <button
          id="mobile_menu_toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-800 hover:text-[#2563EB] focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile_drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-blue-100 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="px-6 py-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left py-2 text-sm font-medium tracking-wide border-b border-slate-100 transition-colors ${
                    activeSection === link.id ? "text-[#2563EB] font-bold" : "text-slate-600"
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-2 flex flex-col space-y-2">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        onOpenDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-50 text-[#2563EB] text-center text-xs py-2.5 rounded-lg flex items-center justify-center space-x-2 border border-blue-100"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
                      <span>Home Dashboard ({currentUser.name})</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-rose-50 text-rose-600 text-center text-xs py-2.5 rounded-lg flex items-center justify-center space-x-2 border border-rose-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Account</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onOpenAuth("login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-50 text-slate-800 text-center text-xs py-2.5 rounded-lg border border-slate-200"
                    >
                      Login Account
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth("register");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-[#2563EB] text-center text-xs py-2.5 text-white rounded-lg font-bold shadow-lg shadow-[#2563EB]/20"
                    >
                      Free Brand Audit Registration
                    </button>
                  </>
                )}
              </div>

              {/* Branded Social Media Links for Mobile */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-6">
                <a
                  href="https://instagram.com/jaytechvisualconcepts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-[#E1306C] rounded-full transition-colors cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com/@jaytechvisualconcepts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-full transition-colors cursor-pointer"
                  title="TikTok"
                >
                  <Music className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/jaytechvisualconcepts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-[#1877F2] rounded-full transition-colors cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
