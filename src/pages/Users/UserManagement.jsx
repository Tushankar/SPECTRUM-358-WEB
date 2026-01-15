import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  Menu,
  Plus,
  X,
  Trash2,
  Edit,
  Home,
  User,
} from "lucide-react";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/api";

const UserManagement = () => {
  const { adminRegisterUser } = useAuth();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    businessCategory: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);

  // Location data state
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      if (data.error === false) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryName) => {
    try {
      setLoadingStates(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName })
      });
      const data = await response.json();
      if (data.error === false) {
        setStates(data.data.states);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      setLoadingCities(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, state: stateName })
      });
      const data = await response.json();
      if (data.error === false) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

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

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const response = await authService.getUsers();
      if (response.users) {
        // Filter out admin users so only regular users are shown
        const nonAdminUsers = response.users.filter((u) => {
          // include user if role is not explicitly 'admin' (case-insensitive)
          return !(u.role && String(u.role).toLowerCase() === "admin");
        });

        // Sort by creation date descending (newest first)
        const sortedUsers = nonAdminUsers.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });

        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      showToast(error.message || "Failed to load users", "error");
    } finally {
      setFetchingUsers(false);
    }
  };

  const formatUserForTable = (user) => {
    return {
      id: user.id || user.uid,
      uid: user.uid,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Unknown User",
      email: user.email || "No email",
      phone: user.phone || "N/A",
      package: "Standard Package", // Default package until you implement packages
      joiningDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Unknown",
      status: user.isActive !== false ? "Active" : "Inactive", // Default to Active if not explicitly false
      profilePicture: user.profilePicture,
      role: user.role,
    };
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      businessCategory: "",
    });
    setFormErrors({});
    setStates([]);
    setCities([]);
  };

  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If country changes, reset state and city
    if (name === 'country') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        state: "",
        city: ""
      }));
      setStates([]);
      setCities([]);
      if (value) {
        fetchStates(value);
      }
    } else if (name === 'state') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        city: "" // Reset city when state changes
      }));
      setCities([]);
      if (value && formData.country) {
        fetchCities(formData.country, value);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateUser(e);
  };

  const handleCloseModal = () => {
    resetForm();
    setShowAddUserModal(false);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await authService.deleteUser(userId);

      // Remove user from local state
      setUsers((prev) => prev.filter((user) => user.uid !== userId));
      showToast("User deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(
        error.message || "Failed to delete user. Please try again.",
        "error"
      );
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", // Don't pre-fill password
      confirmPassword: "", // Don't pre-fill password
      phone: user.phone || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      businessCategory: user.businessCategory || "",
    });
    
    // Fetch states and cities if country/state are pre-filled
    if (user.country) {
      fetchStates(user.country);
      if (user.state) {
        fetchCities(user.country, user.state);
      }
    }
    
    setShowEditUserModal(true);
  };

  const handleCloseEditModal = () => {
    resetForm();
    setEditingUser(null);
    setShowEditUserModal(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // For edit mode, password is optional
    const isEditMode = !!editingUser;

    if (!isEditMode && !validateForm()) {
      return;
    }

    // For edit mode, validate only filled fields
    if (isEditMode) {
      const errors = {};

      if (!formData.firstName.trim()) {
        errors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        errors.lastName = "Last name is required";
      }
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }

      // Only validate password if it's provided
      if (formData.password && formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
      }
      if (formData.password && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // Update existing user
        const updateData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country,
          state: formData.state,
          city: formData.city,
          businessCategory: formData.businessCategory,
        };

        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await authService.updateUser(
          editingUser.uid,
          updateData
        );

        if (response.user) {
          // Update user in local state
          setUsers((prev) =>
            prev.map((user) =>
              user.uid === editingUser.uid ? response.user : user
            )
          );

          showToast("User updated successfully!", "success");
          handleCloseEditModal();
        }
      } else {
        // Create new user (existing logic)
        const userData = {
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          country: formData.country,
          state: formData.state,
          city: formData.city,
          businessCategory: formData.businessCategory,
          role: "user",
        };

        const result = await adminRegisterUser(userData);

        if (result.success) {
          const response = result.data;

          const newUser = {
            id: response.user.uid,
            uid: response.user.uid,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            phone: response.user.phone || "",
            country: response.user.country || "",
            state: response.user.state || "",
            city: response.user.city || "",
            businessCategory: response.user.businessCategory || "",
            profilePicture: response.user.profilePicture,
            role: response.user.role,
            isActive: response.user.isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setUsers((prev) => [newUser, ...prev]);

          showToast(
            `User created successfully${
              response.emailSent
                ? ` and credentials sent to ${response.user.email}`
                : ""
            }!`,
            "success"
          );

          resetForm();
          setShowAddUserModal(false);
        } else {
          showToast(
            result.error || "Failed to create user. Please try again.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error processing user:", error);
      showToast(
        error.message || "Failed to process user. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const isActive = newStatus === "Active";
      const response = await authService.updateUserStatus(userId, isActive);

      // Backend returns { message, userId, isActive } on success
      if (response.message) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) =>
            user.uid === userId ? { ...user, isActive: isActive } : user
          )
        );
        showToast(response.message, "success");
      } else {
        showToast(response.error || "Failed to update user status", "error");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showToast(error.message || "Failed to update user status", "error");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
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
      <Header title="User Management" icon={User} />

      {/* User Management Content */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold poppins-semibold">
                  User Management
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1 poppins-regular">
                  Manage all users from your database. Only admin accounts are
                  hidden for security.
                </p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium poppins-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Loading State */}
          {fetchingUsers ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5B700] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first user.
              </p>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center px-4 py-2 bg-[#E5B700] text-white rounded-lg text-sm font-medium hover:bg-[#DE8806] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First User
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-hidden">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joining On
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => {
                      const formattedUser = formatUserForTable(user);
                      return (
                        <tr key={formattedUser.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                <img
                                  src={
                                    formattedUser.profilePicture ||
                                    `https://i.pravatar.cc/40?u=${formattedUser.email}`
                                  }
                                  alt={formattedUser.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                                    index
                                  )} hidden`}
                                >
                                  {getInitials(formattedUser.name)}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {formattedUser.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formattedUser.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formattedUser.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formattedUser.package}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formattedUser.joiningDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <select
                                value={formattedUser.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    formattedUser.uid,
                                    e.target.value
                                  )
                                }
                                className={`appearance-none px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-[#E5B700] ${getStatusStyle(
                                  formattedUser.status
                                )}`}
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    formattedUser.uid,
                                    formattedUser.name
                                  )
                                }
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet View */}
              <div className="hidden md:block lg:hidden overflow-x-hidden">
                <div className="divide-y divide-gray-200">
                  {users.map((user, index) => {
                    const formattedUser = formatUserForTable(user);
                    return (
                      <div
                        key={formattedUser.id}
                        className="p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center flex-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img
                                src={
                                  formattedUser.profilePicture ||
                                  `https://i.pravatar.cc/40?u=${formattedUser.email}`
                                }
                                alt={formattedUser.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                                  index
                                )} hidden`}
                              >
                                {getInitials(formattedUser.name)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {formattedUser.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {formattedUser.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formattedUser.phone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <select
                                value={formattedUser.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    formattedUser.uid,
                                    e.target.value
                                  )
                                }
                                className={`appearance-none px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-[#E5B700] ${getStatusStyle(
                                  formattedUser.status
                                )}`}
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    formattedUser.uid,
                                    formattedUser.name
                                  )
                                }
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Package:</span>{" "}
                            {formattedUser.package}
                          </div>
                          <div>
                            <span className="font-medium">Joining:</span>{" "}
                            {formattedUser.joiningDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden overflow-x-hidden">
                <div className="divide-y divide-gray-200">
                  {users.map((user, index) => {
                    const formattedUser = formatUserForTable(user);
                    return (
                      <div key={formattedUser.id} className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img
                                src={
                                  formattedUser.profilePicture ||
                                  `https://i.pravatar.cc/40?u=${formattedUser.email}`
                                }
                                alt={formattedUser.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(
                                  index
                                )} hidden`}
                              >
                                {getInitials(formattedUser.name)}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {formattedUser.name}
                              </h4>
                              <div className="relative mt-1">
                                <select
                                  value={formattedUser.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      formattedUser.uid,
                                      e.target.value
                                    )
                                  }
                                  className={`appearance-none px-2 py-0.5 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-[#E5B700] ${getStatusStyle(
                                    formattedUser.status
                                  )}`}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                                <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleDeleteUser(
                                  formattedUser.uid,
                                  formattedUser.name
                                )
                              }
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit user"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="truncate ml-2 max-w-[150px]">
                              {formattedUser.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Phone:</span>
                            <span>{formattedUser.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Package:</span>
                            <span>{formattedUser.package}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Joining:</span>
                            <span>{formattedUser.joiningDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddUserModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Add User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new user account. Login credentials will be sent via
                  email.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                      formErrors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password*
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm Password*
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Address (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm"
                          >
                            <option value="">Select country</option>
                            {countries.map((country) => (
                              <option key={country.country} value={country.country}>
                                {country.country}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          State
                        </label>
                        <div className="relative">
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!formData.country}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {loadingStates ? "Loading states..." : formData.country ? "Select state" : "Select country first"}
                            </option>
                            {states.map((state) => (
                              <option key={state.name} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        City
                      </label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!formData.state}
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {loadingCities ? "Loading cities..." : formData.state ? "Select city" : "Select state first"}
                          </option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Category
                  </label>
                  <div className="relative">
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm"
                    >
                      <option value="">Select Business Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors text-sm order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating User..." : "Create User"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm order-1 sm:order-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseEditModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Close button */}
            <button
              onClick={handleCloseEditModal}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Edit User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update user information. Leave password fields empty to keep
                  current password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateUser} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                      formErrors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password (Optional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave empty to keep current"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm ${
                        formErrors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Address (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm"
                          >
                            <option value="">Select country</option>
                            {countries.map((country) => (
                              <option key={country.country} value={country.country}>
                                {country.country}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          State
                        </label>
                        <div className="relative">
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!formData.country}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {loadingStates ? "Loading states..." : formData.country ? "Select state" : "Select country first"}
                            </option>
                            {states.map((state) => (
                              <option key={state.name} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        City
                      </label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!formData.state}
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {loadingCities ? "Loading cities..." : formData.state ? "Select city" : "Select state first"}
                          </option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Category
                  </label>
                  <div className="relative">
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-700 text-sm"
                    >
                      <option value="">Select Business Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors text-sm order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating User..." : "Update User"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm order-1 sm:order-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;