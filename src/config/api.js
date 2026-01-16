// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://spectrum-server-86ba.onrender.com";

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ADMIN_REGISTER_USER: `${API_BASE_URL}/api/auth/admin/register-user`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROFILE: (uid) => `${API_BASE_URL}/api/auth/profile/${uid}`,
    USERS: `${API_BASE_URL}/api/auth/users`,
    USERS_STATS: `${API_BASE_URL}/api/auth/users/stats`,
    DELETE_USER: (userId) => `${API_BASE_URL}/api/auth/users/${userId}`,
    UPDATE_USER: (userId) => `${API_BASE_URL}/api/auth/users/${userId}`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/update-password`,
  },

  // Tickets endpoints
  TICKETS: {
    BASE: `${API_BASE_URL}/api/tickets`,
    BY_ID: (id) => `${API_BASE_URL}/api/tickets/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/api/tickets/user/${userId}`,
    COMMENTS: (id) => `${API_BASE_URL}/api/tickets/${id}/comments`,
    STATS: `${API_BASE_URL}/api/tickets/stats`,
  },

  // Packages endpoints
  PACKAGES: {
    BASE: `${API_BASE_URL}/api/packages`,
    BY_ID: (id) => `${API_BASE_URL}/api/packages/${id}`,
    ACTIVE: `${API_BASE_URL}/api/packages/active/list`,
    STATS: `${API_BASE_URL}/api/packages/stats/overview`,
  },

  // Reports endpoints
  REPORTS: {
    BASE: `${API_BASE_URL}/api/reports`,
    BY_ID: (id) => `${API_BASE_URL}/api/reports/${id}`,
    USER_ANALYTICS: `${API_BASE_URL}/api/reports/generate/user-analytics`,
    TICKET_SUMMARY: `${API_BASE_URL}/api/reports/generate/ticket-summary`,
  },

  // Posts endpoints
  POSTS: {
    ADMIN_REPORTS: `${API_BASE_URL}/api/posts/admin/reports`,
    ADMIN_BLOCKED_USERS: `${API_BASE_URL}/api/posts/admin/blocked-users`,
    ADMIN_STATS: `${API_BASE_URL}/api/posts/admin/stats`,
    ADMIN_DELETE_POST: (postId, postAuthorUserId) => 
      postAuthorUserId 
        ? `${API_BASE_URL}/api/posts/admin/posts/${postId}?postAuthorUserId=${postAuthorUserId}`
        : `${API_BASE_URL}/api/posts/admin/posts/${postId}`,
    ADMIN_BLOCK_USER: (userId) => `${API_BASE_URL}/api/posts/admin/users/${userId}/block`,
    ADMIN_UNBLOCK_USER: (userId) => `${API_BASE_URL}/api/posts/admin/users/${userId}/unblock`,
    ADMIN_ALL_POSTS: (page = 1, limit = 10) => `${API_BASE_URL}/api/posts/admin/all?page=${page}&limit=${limit}`,
  },
};

// HTTP client configuration
export const httpConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
};

export { API_BASE_URL };
