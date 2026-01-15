import { API_ENDPOINTS, httpConfig } from "../config/api.js";

// Generic API call function
const apiCall = async (url, options = {}) => {
  try {
    const config = {
      ...httpConfig,
      ...options,
      headers: {
        ...httpConfig.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

// Auth Services
export const authService = {
  // Login user
  login: async (email, password) => {
    return apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Register user
  register: async (
    email,
    password,
    firstName,
    lastName,
    profilePicture = null,
    role = "user"
  ) => {
    return apiCall(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        profilePicture,
        role,
      }),
    });
  },

  // Admin register user (with email notification)
  adminRegisterUser: async (userData) => {
    return apiCall(API_ENDPOINTS.AUTH.ADMIN_REGISTER_USER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Logout user
  logout: async () => {
    return apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });
  },

  // Get user profile
  getProfile: async (uid) => {
    return apiCall(API_ENDPOINTS.AUTH.PROFILE(uid));
  },

  // Update user profile
  updateProfile: async (uid, updates) => {
    return apiCall(API_ENDPOINTS.AUTH.PROFILE(uid), {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Get all users (admin only)
  getUsers: async () => {
    return apiCall(API_ENDPOINTS.AUTH.USERS);
  },

  // Get user statistics
  getUserStats: async () => {
    return apiCall(API_ENDPOINTS.AUTH.USERS_STATS);
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    return apiCall(API_ENDPOINTS.AUTH.DELETE_USER(userId), {
      method: "DELETE",
    });
  },

  // Update user (admin only)
  updateUser: async (userId, updates) => {
    return apiCall(API_ENDPOINTS.AUTH.UPDATE_USER(userId), {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Send forgot password OTP
  forgotPassword: async (email) => {
    return apiCall(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Verify OTP and get password reset link
  resetPassword: async (email, otp) => {
    return apiCall(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  // Update password after OTP verification
  updatePassword: async (email, newPassword) => {
    return apiCall(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
  },

  // Update user status (Active/Inactive)
  updateUserStatus: async (userId, isActive) => {
    return apiCall(`${API_ENDPOINTS.AUTH.USERS}/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },
};

// Ticket Services
export const ticketService = {
  // Get all tickets
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.assignee) params.set("assignee", filters.assignee);
    const url = params.toString()
      ? `${API_ENDPOINTS.TICKETS.BASE}?${params.toString()}`
      : API_ENDPOINTS.TICKETS.BASE;
    return apiCall(url);
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    return apiCall(API_ENDPOINTS.TICKETS.BY_ID(id));
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    return apiCall(API_ENDPOINTS.TICKETS.BASE, {
      method: "POST",
      body: JSON.stringify(ticketData),
    });
  },

  // Update ticket
  updateTicket: async (id, updates) => {
    return apiCall(API_ENDPOINTS.TICKETS.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete ticket
  deleteTicket: async (id) => {
    return apiCall(API_ENDPOINTS.TICKETS.BY_ID(id), {
      method: "DELETE",
    });
  },

  // Get tickets by user
  getTicketsByUser: async (userId) => {
    return apiCall(API_ENDPOINTS.TICKETS.BY_USER(userId));
  },

  // Add comment to ticket
  addComment: async (id, comment, userId, userEmail) => {
    return apiCall(API_ENDPOINTS.TICKETS.COMMENTS(id), {
      method: "POST",
      body: JSON.stringify({ comment, userId, userEmail }),
    });
  },

  // Get ticket stats
  getStats: async () => {
    return apiCall(API_ENDPOINTS.TICKETS.STATS);
  },
};

// Package Services
export const packageService = {
  // Get all packages
  getPackages: async () => {
    return apiCall(API_ENDPOINTS.PACKAGES.BASE);
  },

  // Get package by ID
  getPackageById: async (id) => {
    return apiCall(API_ENDPOINTS.PACKAGES.BY_ID(id));
  },

  // Create new package
  createPackage: async (packageData) => {
    return apiCall(API_ENDPOINTS.PACKAGES.BASE, {
      method: "POST",
      body: JSON.stringify(packageData),
    });
  },

  // Update package
  updatePackage: async (id, updates) => {
    return apiCall(API_ENDPOINTS.PACKAGES.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete package
  deletePackage: async (id) => {
    console.log("API: Deleting package with ID:", id);
    console.log("API: Delete URL:", API_ENDPOINTS.PACKAGES.BY_ID(id));

    return apiCall(API_ENDPOINTS.PACKAGES.BY_ID(id), {
      method: "DELETE",
    });
  },

  // Get active packages
  getActivePackages: async () => {
    return apiCall(API_ENDPOINTS.PACKAGES.ACTIVE);
  },

  // Get package statistics
  getPackageStats: async () => {
    return apiCall(API_ENDPOINTS.PACKAGES.STATS);
  },
};

// Report Services
export const reportService = {
  // Get all reports
  getReports: async () => {
    return apiCall(API_ENDPOINTS.REPORTS.BASE);
  },

  // Get report by ID
  getReportById: async (id) => {
    return apiCall(API_ENDPOINTS.REPORTS.BY_ID(id));
  },

  // Create new report
  createReport: async (reportData) => {
    return apiCall(API_ENDPOINTS.REPORTS.BASE, {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  },

  // Update report
  updateReport: async (id, updates) => {
    return apiCall(API_ENDPOINTS.REPORTS.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete report
  deleteReport: async (id) => {
    return apiCall(API_ENDPOINTS.REPORTS.BY_ID(id), {
      method: "DELETE",
    });
  },

  // Generate user analytics report
  generateUserAnalytics: async (startDate, endDate) => {
    return apiCall(API_ENDPOINTS.REPORTS.USER_ANALYTICS, {
      method: "POST",
      body: JSON.stringify({ startDate, endDate }),
    });
  },

  // Generate ticket summary report
  generateTicketSummary: async (startDate, endDate) => {
    return apiCall(API_ENDPOINTS.REPORTS.TICKET_SUMMARY, {
      method: "POST",
      body: JSON.stringify({ startDate, endDate }),
    });
  },
};

export default {
  auth: authService,
  ticket: ticketService,
  package: packageService,
  report: reportService,
};
