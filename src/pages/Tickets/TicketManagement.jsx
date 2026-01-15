import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  Users,
  Ticket,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import Header from "../../components/Header";
import { ticketService } from "../../services/api";

const TicketManagement = () => {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    closed: 0,
  });
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    ticketId: "",
    subject: "",
    status: "In Progress",
    priority: "Medium",
    lastUpdate: "",
    assignee: "",
    description: "",
  });

  // Local toaster
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const formatDate = (isoOrDate) => {
    if (!isoOrDate) return "";
    try {
      const d = new Date(isoOrDate);
      if (Number.isNaN(d.getTime())) return String(isoOrDate);
      // 30 July 2025
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(isoOrDate);
    }
  };

  const loadStats = async () => {
    try {
      const data = await ticketService.getStats();
      setStats({
        total: data.total || 0,
        active: data.active || 0,
        resolved: data.resolved || 0,
        closed: data.closed || 0,
      });
    } catch (e) {
      console.error("Failed to load ticket stats", e);
    }
  };

  const loadTickets = async () => {
    try {
      const data = await ticketService.getTickets();
      setTickets(Array.isArray(data.tickets) ? data.tickets : []);
    } catch (e) {
      console.error("Failed to load tickets", e);
    }
  };

  const updateTicketField = async (id, updates) => {
    try {
      await ticketService.updateTicket(id, updates);
      // optimistic update
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      // refresh stats and tickets to ensure consistency (timestamps etc.)
      await Promise.all([loadStats(), loadTickets()]);
      showToast("Ticket updated successfully", "success");
    } catch (e) {
      console.error("Failed to update ticket", e);
      showToast(e?.message || "Failed to update ticket", "error");
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: "",
    status: "In Progress",
    priority: "Medium",
    assignee: "",
    description: "",
    lastUpdate: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const openEdit = (ticket) => {
    setEditingTicket(ticket);
    setEditForm({
      subject: ticket.subject || "",
      status: ticket.status || "In Progress",
      priority: ticket.priority || "Medium",
      assignee: ticket.assignee || "",
      description: ticket.description || "",
      lastUpdate: ticket.lastUpdate
        ? new Date(ticket.lastUpdate).toISOString().slice(0, 10)
        : "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (field) => (e) => {
    setEditForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    if (!editingTicket) return;
    setEditLoading(true);
    const payload = {
      subject: editForm.subject,
      status: editForm.status,
      priority: editForm.priority,
      assignee: editForm.assignee,
      description: editForm.description,
      lastUpdate: editForm.lastUpdate
        ? new Date(editForm.lastUpdate).toISOString()
        : undefined,
    };
    await updateTicketField(editingTicket.id, payload);
    setShowEditModal(false);
    setEditingTicket(null);
    setEditLoading(false);
  };

  const handleDelete = async (ticket) => {
    if (!ticket?.id) return;
    const confirmDelete = window.confirm(
      `Delete ticket ${ticket.ticketId || ticket.id}?`
    );
    if (!confirmDelete) return;
    try {
      await ticketService.deleteTicket(ticket.id);
      await Promise.all([loadStats(), loadTickets()]);
      showToast("Ticket deleted", "success");
    } catch (e) {
      console.error("Failed to delete ticket", e);
      showToast(e?.message || "Failed to delete ticket", "error");
    }
  };

  useEffect(() => {
    loadStats();
    loadTickets();
  }, []);

  const handleChange = (field) => (e) => {
    setNewTicket((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCreateTicket = async () => {
    if (!newTicket.ticketId || !newTicket.subject) return;
    setCreating(true);
    try {
      const payload = {
        ticketId: newTicket.ticketId,
        subject: newTicket.subject,
        status: newTicket.status || "In Progress",
        priority: newTicket.priority || "Medium",
        assignee: newTicket.assignee || undefined,
        description: newTicket.description || "",
        lastUpdate: newTicket.lastUpdate
          ? new Date(newTicket.lastUpdate).toISOString()
          : undefined,
      };
      await ticketService.createTicket(payload);
      setShowNewTicketModal(false);
      setNewTicket({
        ticketId: "",
        subject: "",
        status: "In Progress",
        priority: "Medium",
        lastUpdate: "",
        assignee: "",
        description: "",
      });
      await Promise.all([loadStats(), loadTickets()]);
    } catch (e) {
      console.error("Failed to create ticket", e);
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-green-600 bg-green-50";
      case "Resolved":
        return "text-yellow-600 bg-yellow-50";
      case "Closed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 z-[60] rounded-lg px-4 py-2 shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
      {/* Header */}
      <Header title="Ticket Management" icon={Ticket} />

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <TicketStatCard
            title="Total Ticket"
            value={stats.total.toLocaleString()}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            iconBgColor="bg-[#E5B700]"
          />
          <TicketStatCard
            title="Active Ticket"
            value={stats.active.toLocaleString()}
            icon={<Ticket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            iconBgColor="bg-[#E5B700]"
          />
          <TicketStatCard
            title="Resolved Ticket"
            value={stats.resolved.toLocaleString()}
            icon={
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            }
            iconBgColor="bg-[#E5B700]"
          />
          <TicketStatCard
            title="Closed Ticket"
            value={stats.closed.toLocaleString()}
            icon={<XCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            iconBgColor="bg-[#E5B700]"
          />
        </div>

        {/* Ticket Table/Cards */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                  Ticket Management
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage your team members and their account permissions here.
                </p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assign To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.ticketId || ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                          {ticket.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(ticket.lastUpdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.assignee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => openEdit(ticket)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ticket)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {ticket.ticketId || ticket.id}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span
                          className={`font-medium ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority} Priority
                        </span>
                        <span>Updated: {formatDate(ticket.lastUpdate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openEdit(ticket)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ticket)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      Assigned to:{" "}
                      <span className="font-medium text-gray-900">
                        {ticket.assignee}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {ticket.ticketId || ticket.id}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openEdit(ticket)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ticket)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                          {ticket.status}
                        </span>
                        <span
                          className={`text-xs font-medium ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Subject:</span>
                      <span className="text-gray-900 text-right max-w-[60%]">
                        {ticket.subject}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Update:</span>
                      <span className="text-gray-900">
                        {formatDate(ticket.lastUpdate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Assigned to:</span>
                      <span className="text-gray-900">{ticket.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewTicketModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowNewTicketModal(false)}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  New Ticket
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new support ticket with the details below.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ticket ID*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Ticket ID"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                      value={newTicket.ticketId}
                      onChange={handleChange("ticketId")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Subject"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                      value={newTicket.subject}
                      onChange={handleChange("subject")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status*
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-900 text-sm"
                        value={newTicket.status}
                        onChange={handleChange("status")}
                      >
                        <option value="">Select Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority*
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-900 text-sm"
                        value={newTicket.priority}
                        onChange={handleChange("priority")}
                      >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Update
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent text-sm"
                      value={newTicket.lastUpdate}
                      onChange={handleChange("lastUpdate")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Assign To
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Assignee Name"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                      value={newTicket.assignee}
                      onChange={handleChange("assignee")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter ticket description..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm resize-none"
                    value={newTicket.description}
                    onChange={handleChange("description")}
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCreateTicket}
                    disabled={creating}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors disabled:opacity-60 text-sm order-2 sm:order-1"
                  >
                    {creating ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm order-1 sm:order-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Edit Ticket
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update ticket details below.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject*
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent text-sm"
                      value={editForm.subject}
                      onChange={handleEditChange("subject")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Assign To
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent text-sm"
                      value={editForm.assignee}
                      onChange={handleEditChange("assignee")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status*
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] text-sm"
                      value={editForm.status}
                      onChange={handleEditChange("status")}
                    >
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority*
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] text-sm"
                      value={editForm.priority}
                      onChange={handleEditChange("priority")}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Update
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] text-sm"
                    value={editForm.lastUpdate}
                    onChange={handleEditChange("lastUpdate")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] text-sm resize-none"
                    value={editForm.description}
                    onChange={handleEditChange("description")}
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors text-sm order-2 sm:order-1 flex items-center justify-center disabled:opacity-60"
                  >
                    {editLoading && (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm order-1 sm:order-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Ticket Stat Card Component - Made responsive
const TicketStatCard = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className="bg-[#011F3F] rounded-lg p-3 sm:p-4 lg:p-6 relative overflow-hidden h-20 sm:h-24 lg:h-28">
      {/* SVG Background Pattern */}
      <svg
        width="140"
        height="140"
        viewBox="0 0 396 406"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -right-16 sm:-right-20 top-1/2 -translate-y-1/2 opacity-80"
      >
        <g opacity="0.8">
          <mask
            id="mask0_1560_15760"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="64"
            y="43"
            width="226"
            height="301"
          >
            <path
              d="M166.454 248.149C30.4109 166.553 36.9495 79.0824 181.303 52.8278C325.657 26.5732 324.493 62.791 178.811 133.605C33.1288 204.419 26.4908 291.935 163.962 328.926C301.434 365.918 302.498 329.746 166.454 248.149Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M166.928 243.067C54.0991 169.041 60.1757 89.2318 180.485 64.8928C300.795 40.5538 299.823 73.5114 178.215 138.535C56.6062 203.558 50.5296 283.367 164.657 316.709C278.785 350.05 279.809 317.207 166.928 243.067Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M167.549 238.096C75.7168 171.584 81.2164 99.4798 179.78 77.0649C278.343 54.65 277.522 84.5077 177.697 143.733C77.8731 202.958 72.4729 275.016 165.467 304.764C258.46 334.512 259.381 304.609 167.549 238.096Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M168.018 233.058C95.0782 173.93 99.9488 109.417 179.022 89.1232C258.043 68.7157 257.221 95.4056 177.175 148.657C97.1298 201.908 92.2072 266.307 166.172 292.591C240.136 318.876 241.058 292.14 168.018 233.058Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M168.638 228.087C112.386 176.261 116.679 119.453 178.315 101.296C239.95 83.1385 239.174 106.501 176.704 153.695C114.233 200.89 109.84 257.743 167.027 280.487C224.213 303.231 224.838 279.801 168.638 228.087Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M169.109 223.049C127.393 178.554 131.109 129.451 177.46 113.4C223.81 97.349 223.184 117.611 176.037 158.825C128.838 199.926 125.121 249.028 167.686 268.474C210.252 287.921 210.825 267.545 169.109 223.049Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M169.68 217.965C140.243 180.605 143.482 139.161 176.803 125.413C210.124 111.665 209.498 128.759 175.517 163.75C141.536 198.741 138.396 240.138 168.393 256.302C198.39 272.466 199.017 255.372 169.68 217.965Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M170.201 213.041C150.991 182.799 153.601 148.947 175.946 137.517C198.29 126.088 197.814 140.082 174.995 168.675C152.076 197.313 149.565 231.119 169.25 244.198C188.934 257.277 189.41 243.282 170.201 213.041Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M170.769 207.956C159.682 184.705 161.615 158.604 175.187 149.576C188.811 140.662 188.434 151.443 174.425 173.759C160.415 196.075 158.482 222.176 170.006 232.139C181.53 242.103 181.856 231.208 170.769 207.956Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M171.292 203.032C166.024 186.733 167.428 168.177 174.384 161.794C181.34 155.411 181.161 162.932 173.857 178.843C166.553 194.753 165.197 213.15 170.765 220.081C176.333 227.011 176.56 219.33 171.292 203.032Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
            <path
              d="M171.86 197.948C170.306 188.473 171.133 177.622 173.725 173.807C176.317 169.991 176.188 174.459 173.433 183.721C170.679 192.984 169.852 203.835 171.568 207.862C173.285 211.89 173.414 207.423 171.86 197.948Z"
              stroke="white"
              strokeWidth="0.866653"
              strokeMiterlimit="10"
            />
          </mask>
          <g mask="url(#mask0_1560_15760)">
            <rect
              opacity="1"
              x="303.508"
              y="319.285"
              width="348.38"
              height="414.597"
              transform="rotate(156.959 303.508 319.285)"
              fill="white"
              stroke="white"
              strokeWidth="0.433326"
            />
          </g>
        </g>
      </svg>

      {/* Content */}
      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 relative z-10">
        <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
          {React.cloneElement(icon, {
            className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#E5B700]",
          })}
        </div>
        <div>
          <p className="text-white text-xs sm:text-sm opacity-80">{title}</p>
          <p className="text-[#E5B700] text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
