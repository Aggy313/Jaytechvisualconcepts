/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Mail, Phone, User, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  initialView?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialView = "login",
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.loginWithGoogle();
      onAuthSuccess(response.user);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Google Authentication was interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === "login") {
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        onAuthSuccess(response.user);
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        const response = await api.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        onAuthSuccess(response.user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || "Authentication process failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0D0D0D]/95 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl"
      >
        {/* Top Edge Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />

        {/* Header Block */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {view === "login" ? "Welcome Back" : "Create Studio Account"}
            </h3>
            <p className="text-gray-400 text-[11px] font-mono mt-0.5">
              {view === "login" ? "Enter your strategic studio keys." : "Register to persist audits and specs."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center focus:outline-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Google Quick Auth Action */}
        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-[#111] hover:bg-[#1C1C1C] text-white border border-white/10 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-3 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{loading ? "Establishing Authorized Access..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center mt-5 mb-2">
            <div className="absolute inset-x-0 h-px bg-white/5" />
            <span className="relative px-3 bg-[#0D0D0D] text-[9px] text-gray-500 font-mono uppercase tracking-widest">
              or use secure credentials
            </span>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4 text-left">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {view === "register" && (
            <div className="flex flex-col">
              <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Sophia Sterling"
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1">
              Email Address / ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="sophia@essentials.co"
                className="w-full bg-[#050505] border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {view === "register" && (
            <div className="flex flex-col">
              <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 012-7502"
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1">
              Lock Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className="w-full bg-[#050505] border border-white/10 text-white rounded-xl py-3 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {view === "register" && (
            <div className="flex flex-col">
              <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1">
                Confirm Lock Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl py-3 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl transition cursor-pointer"
            >
              {loading ? "Authorizing Security..." : view === "login" ? "Sign In Studio" : "Establish Account"}
            </button>
          </div>
        </form>

        {/* Card Footer Toggle view links */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] text-center">
          <p className="text-xs text-gray-400">
            {view === "login" ? "Declined standard templates yet? " : "Already established secure keys? "}
            <button
              onClick={() => {
                setView(view === "login" ? "register" : "login");
                setError(null);
              }}
              className="text-[#06B6D4] hover:text-white font-bold transition focus:outline-none font-mono text-[11px] cursor-pointer"
            >
              {view === "login" ? "Register Free here" : "Login coordinates"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
