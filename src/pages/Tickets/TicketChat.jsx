import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, X } from "lucide-react";
import { ticketService } from "../../services/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-500",
};

const PRIORITY_STYLE = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

const formatFull = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch { return String(iso); }
};

const formatTime = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch { return ""; }
};

const formatDay = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch { return ""; }
};

const groupByDate = (messages) => {
  const groups = {};
  messages.forEach((m) => {
    const key = formatDay(m.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
};

// ─── Meta Row ─────────────────────────────────────────────────────────────────
const MetaRow = ({ label, value, valueClass = "text-gray-800 poppins-semibold" }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 text-xs poppins-medium uppercase tracking-wide">{label}</span>
    <span className={`text-sm ${valueClass}`}>{value || "—"}</span>
  </div>
);

// ─── Chat Bubble ─────────────────────────────────────────────────────────────
// FROM ADMIN PERSPECTIVE:
//   sender === "support" (= Admin/You) → RIGHT side, gold bg
//   sender === "user"   (= App user)   → LEFT side, white bg
const ChatBubble = ({ message }) => {
  const isAdmin = message.sender === "support"; // admin sends as "support"

  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-3 px-1`}>
      {/* Avatar for user messages */}
      {!isAdmin && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-xs">👤</span>
        </div>
      )}

      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
          isAdmin
            ? "bg-[#E5B700] rounded-tr-sm text-white"
            : "bg-white border border-gray-100 rounded-tl-sm"
        }`}
      >
        {/* Sender label */}
        <p className={`text-[10px] poppins-semibold mb-1 ${isAdmin ? "text-yellow-100" : "text-gray-400"}`}>
          {isAdmin ? "You (Admin)" : "User"}
        </p>

        {/* Text */}
        {message.text && (
          <p className={`text-sm poppins-regular leading-relaxed ${isAdmin ? "text-white" : "text-gray-800"}`}>
            {message.text}
          </p>
        )}

        {/* Image attachment */}
        {message.imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-white/20 max-w-[220px]">
            <img
              src={message.imageUrl}
              alt="attachment"
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        {/* Time */}
        <p className={`text-[10px] mt-1.5 poppins-regular ${isAdmin ? "text-yellow-100 text-right" : "text-gray-400 text-right"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>

      {/* Avatar for admin messages */}
      {isAdmin && (
        <div className="w-7 h-7 rounded-full bg-[#E5B700] flex items-center justify-center ml-2 flex-shrink-0 mt-1">
          <span className="text-xs">🛡️</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TicketChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [replyText, setReplyText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [sending, setSending] = useState(false);

  // ── Status update (admin can change status from sidebar of chat)
  const [currentStatus, setCurrentStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load ticket
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingTicket(true);
        const data = await ticketService.getTicketById(id);
        const t = data.ticket || data;
        setTicket(t);
        setCurrentStatus(t.status);
      } catch (e) {
        console.error("Load ticket error:", e);
      } finally {
        setLoadingTicket(false);
      }
    };
    load();
  }, [id]);

  // Load messages
  const loadMessages = async () => {
    try {
      setLoadingMessages(true);
      const data = await ticketService.getMessages(id);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (e) {
      console.error("Load messages error:", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => { if (id) loadMessages(); }, [id]);

  // Auto-scroll to latest
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Handle image pick
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Send reply (admin → sender: "support")
  const handleSend = async () => {
    const text = replyText.trim();
    if (!text && !imagePreview) return;
    setSending(true);

    const optimistic = {
      id: "opt-" + Date.now(),
      sender: "support",
      text: text || null,
      imageUrl: imagePreview || null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setReplyText("");
    clearImage();

    try {
      await ticketService.sendMessage(id, {
        sender: "support",
        text: text || null,
        imageUrl: imagePreview || null,
      });
      await loadMessages(); // sync with server
    } catch (e) {
      console.error("Send error:", e);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  };

  // Admin changes ticket status directly from chat
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await ticketService.updateTicket(id, { status: newStatus });
      setCurrentStatus(newStatus);
      setTicket((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (e) {
      console.error("Status update error:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const dateGroups = groupByDate(messages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ─── Top Header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-[#E5B700]/10 text-gray-600 hover:text-[#E5B700] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="poppins-semibold text-gray-900 text-base leading-tight truncate">
            {loadingTicket ? "Loading..." : (ticket?.subject || "Ticket Raise")}
          </h1>
          <p className="text-xs text-gray-400 poppins-regular">
            {ticket?.ticketId || (id ? "#" + id.slice(0, 8) : "")}
          </p>
        </div>

        {/* Status dropdown — admin can change from here */}
        {currentStatus && (
          <div className="relative">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className={`text-xs poppins-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-[#E5B700] ${
                STATUS_STYLE[currentStatus] || "bg-gray-100 text-gray-600"
              }`}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            {updatingStatus && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-60" />
            )}
          </div>
        )}
      </div>

      {/* ─── Body ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loadingTicket ? (
          <div className="p-4 space-y-3">
            <div className="bg-white rounded-2xl h-36 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Ticket Metadata Card */}
            {ticket && (
              <div className="mx-4 mt-4 mb-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="poppins-semibold text-gray-900 text-sm">Ticket Details</span>
                  <span className={`text-[10px] poppins-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[currentStatus] || "bg-gray-100 text-gray-600"}`}>
                    {currentStatus}
                  </span>
                </div>
                <MetaRow label="Assigned To" value={ticket.assignee} />
                <MetaRow label="Created On" value={formatFull(ticket.createdAt)} />
                <MetaRow label="Last Updated" value={formatFull(ticket.updatedAt || ticket.lastUpdate)} />
                <MetaRow
                  label="Priority"
                  value={ticket.priority}
                  valueClass={`poppins-bold ${PRIORITY_STYLE[ticket.priority] || "text-gray-800"}`}
                />
                <MetaRow label="Type" value={ticket.type || ticket.category || "Bug Report"} />
              </div>
            )}

            {/* ─── Chat Thread ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto py-3" style={{ minHeight: 0 }}>
              {loadingMessages ? (
                <div className="flex flex-col gap-3 px-4 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-12 rounded-2xl animate-pulse bg-gray-200 ${i % 2 === 0 ? "ml-auto w-48" : "w-52"}`} />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="poppins-medium text-gray-500 text-sm">No messages yet</p>
                  <p className="poppins-regular text-gray-400 text-xs mt-1">Reply below to start the conversation.</p>
                </div>
              ) : (
                <div className="px-2">
                  {Object.entries(dateGroups).map(([date, msgs]) => (
                    <div key={date}>
                      {/* Date separator */}
                      <div className="flex items-center gap-3 my-4 px-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] poppins-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                          {date}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      {msgs.map((m) => <ChatBubble key={m.id} message={m} />)}
                    </div>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ─── Reply Input ─────────────────────────────── */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex-shrink-0">
              {/* Image preview strip */}
              {imagePreview && (
                <div className="relative inline-block mb-2">
                  <img src={imagePreview} alt="preview" className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-sm" />
                  <button
                    onClick={clearImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                {/* File upload */}
                <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImageSelect} />
                <button
                  onClick={() => fileRef.current?.click()}
                  title="Attach image"
                  className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-[#E5B700]/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#E5B700] transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text area */}
                <textarea
                  rows={1}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply as Admin..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm poppins-regular text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E5B700]/50 focus:border-[#E5B700] resize-none max-h-28 overflow-y-auto"
                  style={{ minHeight: "42px" }}
                />

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={sending || (!replyText.trim() && !imagePreview)}
                  title="Send reply"
                  className="flex-shrink-0 w-10 h-10 bg-[#E5B700] hover:bg-[#D4A800] disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 poppins-regular mt-1.5 text-center">
                Your replies send as <strong>Support / Admin</strong> · Press Enter to send
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        .poppins-regular  { font-family: 'Poppins', sans-serif; font-weight: 400; }
        .poppins-medium   { font-family: 'Poppins', sans-serif; font-weight: 500; }
        .poppins-semibold { font-family: 'Poppins', sans-serif; font-weight: 600; }
        .poppins-bold     { font-family: 'Poppins', sans-serif; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default TicketChat;
