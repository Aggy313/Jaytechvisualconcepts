/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User as UserIcon,
  ShieldCheck,
  TrendingUp,
  FileText,
  Inbox,
  AlertCircle,
  Database,
  BarChart2,
  RefreshCw,
  Edit,
  CheckCircle,
  UserCheck,
  ArrowRight,
  Mail
} from "lucide-react";
import { User, Lead, Message } from "../types";
import { api } from "../lib/api";
import GmailHub from "./GmailHub";

interface DashboardProps {
  currentUser: User | null;
  onLogout: () => void;
  onClose: () => void;
  onNavigateToAudit: () => void;
}

export default function Dashboard({
  currentUser,
  onLogout,
  onClose,
  onNavigateToAudit,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "admin" | "audits" | "gmail">("profile");

  // Inputs for updates
  const [updateForm, setUpdateForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    avatar: currentUser?.avatar || "",
  });

  // Admin Metrics State
  const [adminMetrics, setAdminMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync update inputs if user loads late
  useEffect(() => {
    if (currentUser) {
      setUpdateForm({
        name: currentUser.name,
        phone: currentUser.phone || "",
        avatar: currentUser.avatar || "",
      });
      // Default to admin tab if user has permission
      if (currentUser.isAdmin) {
        setActiveTab("admin");
      }
    }
  }, [currentUser]);

  // Load Admin stats if required
  useEffect(() => {
    if (activeTab === "admin" && currentUser?.isAdmin) {
      fetchAdminStats();
    }
  }, [activeTab, currentUser]);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminMetrics();
      setAdminMetrics(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin telemetry grids.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setError(null);
    try {
      await api.updateProfile(updateForm);
      setSuccessMsg("Your profile context has been updated successfully.");
    } catch (err: any) {
      setError(err?.message || "Profile update encountered an error.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#FAFBFD] overflow-y-auto pt-24 pb-12 flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] z-0" />

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col space-y-8">
        {/* Dashboard Title banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/80 pb-6 gap-4 text-left">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-md animate-fade-in"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Studio Portal
                </h1>
                {currentUser.isAdmin && (
                  <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-mono uppercase font-bold py-1 px-2 rounded-full animate-pulse">
                    Admin Access
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-mono">
                Operator ID: <span className="text-[#2563EB]">{currentUser.id}</span> • Registered: {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-slate-300 shadow-sm transition cursor-pointer"
            >
              Back to Agency Home
            </button>
            <button
              onClick={onLogout}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-250 pb-2 justify-start gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-xs uppercase font-mono tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Studio Profile
          </button>

          <button
            onClick={() => setActiveTab("gmail")}
            className={`pb-3 text-xs uppercase font-mono tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "gmail"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Gmail Workspace
          </button>

          {currentUser.isAdmin && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`pb-3 text-xs uppercase font-mono tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Admin Database Telemetry
            </button>
          )}

          {!currentUser.isAdmin && (
            <button
              onClick={() => setActiveTab("audits")}
              className={`pb-3 text-xs uppercase font-mono tracking-widest font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "audits"
                  ? "border-[#06B6D4] text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              My Saved Audits
            </button>
          )}
        </div>

        {/* Tab Views */}
        <div>
          {/* TAB 1: STUDIO PROFILE */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              <div className="lg:col-span-4 bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-slate-950 text-base tracking-tight mb-4">Credentials Summary</h3>
                <div className="space-y-4 text-xs font-medium">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-mono text-[9px] uppercase">OPERATOR NAME</span>
                    <p className="text-slate-900 text-sm font-bold mt-0.5">{currentUser.name}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-mono text-[9px] uppercase">SECURE EMAIL</span>
                    <p className="text-slate-900 text-sm font-bold mt-0.5">{currentUser.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[9px] uppercase">TELEPHONE HOTLINE</span>
                    <p className="text-slate-900 text-sm font-bold mt-0.5">{currentUser.phone || "Unprovided. Submit below."}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white border border-blue-100 p-8 rounded-2xl shadow-sm relative">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8.5px] text-slate-500 uppercase font-bold">
                  Encryption Secured
                </div>

                <h3 className="font-bold text-slate-950 text-lg tracking-tight mb-6">Modify Studio Context</h3>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-850 text-xs p-4 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={updateForm.name}
                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                        className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                        Your Phone Contact
                      </label>
                      <input
                        type="text"
                        value={updateForm.phone}
                        onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                        className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-500 mb-1.5">
                      Bespoke Portrait Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={updateForm.avatar}
                      onChange={(e) => setUpdateForm({ ...updateForm, avatar: e.target.value })}
                      placeholder="https://images.unsplash.com/your-hosted-avatar-jpg"
                      className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs font-mono focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition"
                    >
                      Commit Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: MY SAVED AUDITS */}
          {activeTab === "audits" && (
            <div className="bg-white border border-blue-100 p-8 rounded-2xl text-center flex flex-col items-center justify-center py-20 relative overflow-hidden shadow-sm">
              <FileText className="w-12 h-12 text-[#2563EB] mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-2">No Saved Audits Detected</h3>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed mb-6">
                You haven&apos;t run a visual brand diagnostic check under this email key yet. Start immediately and persist your result.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToAudit();
                }}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-blue-500/15 cursor-pointer transition"
              >
                <span>Launch Audit Grid</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 3: ADMIN TELEMETRY */}
          {activeTab === "admin" && currentUser.isAdmin && (
            <div className="space-y-8 text-left">
              {/* Telemetry Numbers row */}
              {adminMetrics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-1">
                      Total Leads Tracked
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-slate-950 leading-none tracking-tight">
                        {adminMetrics.totalLeads}
                      </span>
                      <span className="text-emerald-700 text-[10px] font-mono font-bold">Active CRM</span>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-1">
                      Contact Inquiries Logged
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-slate-950 leading-none tracking-tight">
                        {adminMetrics.totalMessages}
                      </span>
                      <span className="text-[#2563EB] text-[10px] font-mono font-bold">100% Secured</span>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-1">
                      Weighted CRO Metrics
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-emerald-600 leading-none tracking-tight">
                        {adminMetrics.metrics.conversionRate}
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono font-bold">
                        (Avg Score: {adminMetrics.metrics.averageAuditScore})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leads Column */}
                <div className="bg-white border border-blue-100/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-950 text-lg tracking-tight flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span>Recent Audited Leads</span>
                    </h3>
                    <button
                      onClick={fetchAdminStats}
                      className="w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"
                      title="Reload Tables"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {adminMetrics?.recentLeads?.map((lead: any) => (
                      <div
                        key={lead.id}
                        className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl flex flex-col space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-950 text-sm">{lead.businessName}</span>
                          <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold">
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          <span className="text-[10px] font-mono uppercase text-slate-500">REP:</span> {lead.name} •{" "}
                          <span className="text-[10px] font-mono uppercase text-slate-500">TEL:</span> {lead.phone}
                        </div>
                        <div className="text-slate-500 font-mono text-[9.5px]">
                          Received: {new Date(lead.createdAt).toLocaleString()}
                        </div>
                        {lead.auditResponse && (
                          <div className="bg-white border border-slate-200 p-2 rounded-lg text-[10px] text-slate-600 max-h-[80px] overflow-y-auto leading-relaxed">
                            {lead.auditResponse.slice(0, 150)}...
                          </div>
                        )}
                      </div>
                    ))}

                    {(!adminMetrics?.recentLeads || adminMetrics.recentLeads.length === 0) && (
                      <p className="text-xs text-slate-500 text-center font-mono py-8">
                        No active audited leads saved in database pipeline.
                      </p>
                    )}
                  </div>
                </div>

                {/* Messages Column */}
                <div className="bg-white border border-blue-100/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-950 text-lg tracking-tight flex items-center space-x-2">
                      <Inbox className="w-5 h-5 text-[#2563EB]" />
                      <span>Contact Inquiries</span>
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {adminMetrics?.recentMessages?.map((msg: any) => (
                      <div
                        key={msg.id}
                        className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl flex flex-col space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-950 text-sm">{msg.subject}</span>
                          <span className="bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold">
                            Inquiry
                          </span>
                        </div>
                        <div className="text-slate-700 italic font-medium">&ldquo;{msg.message}&rdquo;</div>
                        <div className="text-slate-600">
                          Sender: <span className="text-slate-950 font-bold">{msg.name}</span> ({msg.email})
                        </div>
                        <div className="text-slate-500 font-mono text-[9.5px]">
                          Received: {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}

                    {(!adminMetrics?.recentMessages || adminMetrics.recentMessages.length === 0) && (
                      <p className="text-xs text-slate-500 text-center font-mono py-8">
                        No contact forms received in catalog.
                      </p>
                    )}
                  </div>
                </div>

                {/* Newsletter Subscriptions Column */}
                <div className="bg-white border border-blue-100/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-950 text-lg tracking-tight flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <span>Intelligence Subscribers ({adminMetrics?.totalSubscriptions || 0})</span>
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {adminMetrics?.recentSubscriptions?.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl flex flex-col space-y-2 text-xs text-left"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-950 text-sm truncate">{sub.email}</span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold">
                            Active
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono text-[9.5px]">
                          Subscribed: {new Date(sub.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}

                    {(!adminMetrics?.recentSubscriptions || adminMetrics.recentSubscriptions.length === 0) && (
                      <p className="text-xs text-slate-500 text-center font-mono py-8">
                        No newsletter subscriptions logged yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gmail" && <GmailHub />}
        </div>
      </div>
    </div>
  );
}
