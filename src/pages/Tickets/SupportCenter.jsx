import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Clock, Calendar } from "lucide-react";
import Header from "../../components/Header";
import { ticketService } from "../../services/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Open: {
    label: "Open",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
    cardIcon: "🎫",
    cardBg: "from-[#0F2554] to-[#1A3A6B]",
    iconBg: "bg-[#E5B700]",
  },
  "In Progress": {
    label: "Progress",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
    cardIcon: "⚙️",
    cardBg: "from-[#0F2554] to-[#1A3A6B]",
    iconBg: "bg-[#E5B700]",
  },
  Resolved: {
    label: "Resolved",
    bg: "bg-green-50",
    text: "text-green-600",
    dot: "bg-green-500",
    cardIcon: "✅",
    cardBg: "from-[#0F2554] to-[#1A3A6B]",
    iconBg: "bg-[#E5B700]",
  },
  Closed: {
    label: "Closed",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-500",
    cardIcon: "🔒",
    cardBg: "from-[#0F2554] to-[#1A3A6B]",
    iconBg: "bg-[#E5B700]",
  },
};

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(iso);
  }
};

const formatTime = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-[#0F2554] to-[#1B3B6F] rounded-2xl p-4 flex flex-col items-start gap-3 shadow-lg">
    <div className="w-10 h-10 bg-[#E5B700] rounded-xl flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <p className="text-gray-300 text-xs poppins-medium leading-none mb-1">
        {label}
      </p>
      <p className="text-white text-2xl poppins-bold leading-none">{value}</p>
    </div>
  </div>
);

// ─── Ticket Card ─────────────────────────────────────────────────────────────

const TicketCard = ({ ticket, onClick }) => {
  const dateVal = ticket.lastUpdate || ticket.createdAt;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-[#E5B700]/40 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="poppins-semibold text-gray-900 text-base leading-snug truncate mb-1">
            {ticket.subject || ticket.title || "Untitled"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-gray-500 text-xs poppins-regular">
              🎫
              <span className="font-medium text-gray-700">
                Ticket ID : {ticket.ticketId || "#" + ticket.id?.slice(0, 8)}
              </span>
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-xs poppins-regular">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(dateVal)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(dateVal)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-[#E5B700]/10 rounded-full flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-[#E5B700]" />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TAB_OPTIONS = ["All", "Open", "In Progress", "Resolved", "Closed"];

const SupportCenter = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, active: 0, resolved: 0, closed: 0 });
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsData, ticketsData] = await Promise.all([
        ticketService.getStats(),
        ticketService.getTickets(),
      ]);
      setStats({
        open: statsData.open || 0,
        active: statsData.active || 0,
        resolved: statsData.resolved || 0,
        closed: statsData.closed || 0,
      });
      setTickets(Array.isArray(ticketsData.tickets) ? ticketsData.tickets : []);
    } catch (e) {
      console.error("Support center load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredTickets = useMemo(() => {
    let list = tickets;

    // Tab filter
    if (activeTab !== "All") {
      list = list.filter((t) => t.status === activeTab);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const id = (t.ticketId || "").toLowerCase();
        const subject = (t.subject || t.title || "").toLowerCase();
        return id.includes(q) || subject.includes(q);
      });
    }

    return list;
  }, [tickets, activeTab, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Header title="Support Center" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Ticket ID or Title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent poppins-regular text-gray-800 placeholder-gray-400 text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E5B700] rounded-xl flex items-center justify-center hover:bg-[#D4A800] transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon="🎫" label="Open" value={String(stats.open).padStart(2, "0")} />
          <StatCard icon="⚙️" label="Progress" value={String(stats.active).padStart(2, "0")} />
          <StatCard icon="✅" label="Resolved" value={String(stats.resolved).padStart(2, "0")} />
          <StatCard icon="🔒" label="Closed" value={String(stats.closed).padStart(2, "0")} />
        </div>

        {/* Tab Filter Bar */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm poppins-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#E5B700] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#E5B700] hover:text-[#E5B700]"
              }`}
            >
              {tab === "In Progress" ? "Progress" : tab}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">🎫</p>
            <p className="poppins-semibold text-gray-700 text-lg">No tickets found</p>
            <p className="poppins-regular text-gray-400 text-sm mt-1">
              {search ? "Try a different search term." : "No tickets in this category yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/tickets/${ticket.id}/chat`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .poppins-regular { font-family: 'Poppins', sans-serif; font-weight: 400; }
        .poppins-medium  { font-family: 'Poppins', sans-serif; font-weight: 500; }
        .poppins-semibold{ font-family: 'Poppins', sans-serif; font-weight: 600; }
        .poppins-bold    { font-family: 'Poppins', sans-serif; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default SupportCenter;
