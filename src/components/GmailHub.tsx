/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Send,
  Inbox,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search,
  Eye,
  Loader,
  X,
  Plus,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  User
} from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

// Native Base64 URL decoding
function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    return "Failed to parse raw body contents.";
  }
}

// Traverse Gmail message MIME structure to extract plain text
function getMessageBody(payload: any): string {
  if (!payload) return "No email body present.";
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
    // Deep fallback traversal
    for (const part of payload.parts) {
      if (part.parts) {
        const nestedBody = getMessageBody(part);
        if (nestedBody) return nestedBody;
      }
    }
  }
  return "Unable to parse multi-part body content.";
}

function getHeader(headers: any[], name: string): string {
  if (!headers) return "";
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : "";
}

export default function GmailHub() {
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"inbox" | "compose">("inbox");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Message details drawer
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [selectedMsgBody, setSelectedMsgBody] = useState<string>("");
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Compose states
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  // Security confirmation state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Trigger Google workspace OAuth Popup to authorize Gmail access
  const handleAuthorizeGmail = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
      provider.addScope("https://www.googleapis.com/auth/gmail.send");
      provider.addScope("https://www.googleapis.com/auth/gmail.modify");

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential || !credential.accessToken) {
        throw new Error("Unable to extract Google Workspace Access Token from Firebase Auth popup.");
      }

      setGmailToken(credential.accessToken);
      setSuccessMsg("Context Authorized! Loading Gmail thread...");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Google OAuth permission request has cancelled or suspended.");
    } finally {
      setLoading(false);
    }
  };

  // List messages from Gmail inbox
  const fetchInbox = async () => {
    if (!gmailToken) return;
    setLoading(true);
    setError(null);
    try {
      const listRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8",
        {
          headers: { Authorization: `Bearer ${gmailToken}` },
        }
      );

      if (!listRes.ok) {
        if (listRes.status === 401) {
          // Token expired, clear cache
          setGmailToken(null);
          throw new Error("Your Gmail session has expired. Please re-authenticate.");
        }
        throw new Error("Failed to load your email threads from Gmail Servers.");
      }

      const listData = await listRes.json();
      const rawMsgs = listData.messages || [];

      // Sequentially fetch content headers for each message id
      const detailedMessages = await Promise.all(
        rawMsgs.map(async (m: { id: string }) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              {
                headers: { Authorization: `Bearer ${gmailToken}` },
              }
            );
            if (!detailRes.ok) return null;
            const detailData = await detailRes.json();
            return {
              id: m.id,
              snippet: detailData.snippet,
              headers: detailData.payload?.headers || [],
              date: getHeader(detailData.payload?.headers || [], "Date"),
              from: getHeader(detailData.payload?.headers || [], "From"),
              subject: getHeader(detailData.payload?.headers || [], "Subject") || "(No Subject)",
            };
          } catch (e) {
            return null;
          }
        })
      );

      setMessages(detailedMessages.filter(Boolean));
    } catch (err: any) {
      setError(err?.message || "Inability to load inbox stream.");
    } finally {
      setLoading(false);
    }
  };

  // Sync index automatically on token initialization or sub-tab navigation
  useEffect(() => {
    if (gmailToken && activeSubTab === "inbox") {
      fetchInbox();
    }
  }, [gmailToken, activeSubTab]);

  // Fetch full nested detail of a message for parsing text body
  const showDetail = async (msg: any) => {
    if (!gmailToken) return;
    setSelectedMsg(msg);
    setSelectedMsgBody("");
    setLoadingDetails(true);
    try {
      const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: { Authorization: `Bearer ${gmailToken}` },
      });
      if (!res.ok) throw new Error("Could not construct email raw detail payload.");
      const data = await res.json();
      const bodyText = getMessageBody(data.payload);
      setSelectedMsgBody(bodyText);
    } catch (err: any) {
      setSelectedMsgBody("Unable to display full email contents. Summary snippet is: " + msg.snippet);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle composing and raw MIME submission
  const initiateSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      setError("Please complete all destination, subject line, and body template details.");
      return;
    }
    // Mandatory Workspace user confirmation step
    setShowConfirmModal(true);
  };

  const handleConfirmedSend = async () => {
    setShowConfirmModal(false);
    if (!gmailToken) return;
    setSending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const emailContent = [
        `To: ${composeForm.to}`,
        `Subject: ${composeForm.subject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        `Content-Transfer-Encoding: 7bit`,
        "",
        composeForm.body,
      ].join("\r\n");

      // Base64URL encode the plain email MIME
      const base64Encoded = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gmailToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: base64Encoded }),
      });

      if (!res.ok) {
        throw new Error("Unable to push email down Google Workspace API transport logs.");
      }

      setSuccessMsg("Email successfully sent on behalf of your Google Account!");
      setComposeForm({ to: "", subject: "", body: "" });
      setActiveSubTab("inbox");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || "Internal failure sending mail envelope.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl relative w-full text-left">
      {/* Decorative branding elements */}
      <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-gray-600 uppercase font-bold tracking-widest flex items-center space-x-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        <span>GMAIL LOGISTICS APIS</span>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-white text-lg tracking-tight flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-400" />
          <span>Gmail Studio Hub</span>
        </h3>
        <p className="text-gray-400 text-xs mt-1 max-w-lg">
          Connect your secure corporate Google interface to preview messages, compose direct consultations, or trace inbox communication parameters with clients.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* DISCONNECTED STATE (OAUTH PROMPT) */}
      {!gmailToken ? (
        <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/15">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Gmail Integration Inactive</h4>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            Please authenticate using Google Workspace OAuth to read inbox queries and send secure template notifications safely.
          </p>

          <button
            onClick={handleAuthorizeGmail}
            disabled={loading}
            className="gsi-material-button text-xs font-bold border border-white/10 rounded-xl hover:bg-white/5 transition flex items-center justify-center space-x-3 w-full py-3 cursor-pointer disabled:opacity-55"
          >
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block", width: "16px", height: "16px" }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span className="text-white text-[11px] font-mono uppercase tracking-wider">
              {loading ? "Requesting brand permission..." : "Authorize Gmail Access"}
            </span>
          </button>
        </div>
      ) : (
        /* CONNECTED VIEW WITH INBOX / COMPOSE TABS */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex space-x-3 text-xs font-mono">
              <button
                onClick={() => {
                  setActiveSubTab("inbox");
                  setSelectedMsg(null);
                }}
                className={`pb-2 px-1 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition ${
                  activeSubTab === "inbox" ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Recent Inbox
              </button>
              <button
                onClick={() => setActiveSubTab("compose")}
                className={`pb-2 px-1 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition ${
                  activeSubTab === "compose" ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Compose Email
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchInbox}
                disabled={loading}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition cursor-pointer"
                title="Sync threads"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setGmailToken(null)}
                className="bg-rose-950/20 border border-rose-500/10 text-rose-400 text-[10px] font-mono px-3 py-1.5 rounded-lg hover:bg-rose-950/40 transition cursor-pointer"
              >
                Revoke Session
              </button>
            </div>
          </div>

          {/* TAB: INBOX */}
          {activeSubTab === "inbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[350px]">
              {/* Message List */}
              <div className={`${selectedMsg ? "lg:col-span-6" : "lg:col-span-12"} space-y-2 max-h-[460px] overflow-y-auto pr-1`}>
                {loading && messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-mono text-xs">
                    <Loader className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                    <span>Synchronizing Secure OAuth Streams...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center border border-dashed border-white/5 rounded-xl">
                    <Inbox className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-xs">No email items were retrieved from Gmail inbox catalog.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => showDetail(msg)}
                      className={`group p-4 rounded-xl border transition-all text-xs text-left cursor-pointer ${
                        selectedMsg?.id === msg.id
                          ? "bg-blue-950/20 border-blue-500/30"
                          : "bg-white/[0.01] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-bold text-white truncate max-w-[200px]" title={msg.from}>
                          {msg.from.replace(/<.*>/, "")}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono flex-shrink-0">
                          {new Date(msg.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-200 truncate group-hover:text-white mb-1">
                        {msg.subject}
                      </div>
                      <div className="text-gray-500 truncate text-[11px] font-normal leading-relaxed">
                        {msg.snippet}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Detail Drawer */}
              {selectedMsg && (
                <div className="lg:col-span-6 bg-white/[0.01] border border-white/5 p-6 rounded-xl flex flex-col max-h-[460px] relative text-left">
                  <button
                    onClick={() => setSelectedMsg(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg transition"
                    title="Close Details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="border-b border-white/5 pb-4 mb-4 pr-6">
                    <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">From</div>
                    <div className="text-white text-xs font-bold leading-relaxed">{selectedMsg.from}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase mb-1">Subject</div>
                    <h4 className="text-white text-sm font-bold tracking-tight">{selectedMsg.subject}</h4>
                    <div className="text-[9px] text-gray-500 font-mono mt-1">{selectedMsg.date}</div>
                  </div>

                  <div className="flex-1 overflow-y-auto text-xs text-gray-300 leading-relaxed font-normal whitespace-pre-wrap pr-1 bg-black/30 p-4 rounded-xl border border-white/5 min-h-[140px]">
                    {loadingDetails ? (
                      <div className="flex items-center justify-center py-12 space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="font-mono text-[10px] text-gray-500">Retrieving payload...</span>
                      </div>
                    ) : (
                      selectedMsgBody
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: COMPOSE */}
          {activeSubTab === "compose" && (
            <form onSubmit={initiateSendEmail} className="space-y-4 text-xs font-normal max-w-2xl">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1.5">
                    Destination Email Address (To)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                    className="bg-[#050505] border border-white/10 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bespoke Design consultation details"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    className="bg-[#050505] border border-white/10 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 mb-1.5">
                    E-mail Body Content
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Type your message details here..."
                    value={composeForm.body}
                    onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                    className="bg-[#050505] border border-white/10 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 font-medium leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? "Sending Transports..." : "Send Verification Message"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECURITY VERIFICATION DIALOG MODAL (MANDATORY OPERATION ACCESS) */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B1220] border border-white/10 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative"
            >
              <div className="flex items-center space-x-3 mb-4 text-blue-400">
                <Mail className="w-6 h-6" />
                <h4 className="text-base font-bold text-white tracking-tight">Confirm Sending Email</h4>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed mb-6">
                You are about to securely send an email to <span className="text-[#06B6D4] font-semibold">{composeForm.to}</span> using the Gmail API on behalf of your authenticated Google Account. Please confirm you authorize this transaction.
              </p>

              <div className="bg-black/35 border border-white/5 p-4 rounded-xl mb-6 text-left space-y-2">
                <div>
                  <span className="text-[8.5px] font-mono text-gray-500 block">SUBJECT LINE</span>
                  <span className="text-xs text-white font-medium">{composeForm.subject}</span>
                </div>
                <div>
                  <span className="text-[8.5px] font-mono text-gray-500 block">DESTINATION RECIPIENT</span>
                  <span className="text-xs text-white font-mono">{composeForm.to}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition uppercase font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedSend}
                  className="px-5 py-2.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Confirm Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
