import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  AlertCircle,
  Search, // Kept if needed later, though not used in simplified version
} from "lucide-react";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { 
  useGetUsersQuery, 
  useRegisterUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation, 
  useUpdateUserStatusMutation 
} from "../../features/api/apiSlice";

const UserManagement = () => {
  // UI State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Form State
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

  // Location data state (kept local fetch for now as it's external API)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Toaster
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  // RTK Query Hooks
  const { data, isLoading, isFetching, error } = useGetUsersQuery({ 
    page: currentPage, 
    limit: 10 
  });
  
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateStatus] = useUpdateUserStatusMutation();

  // Derived Data
  const rawUsers = data?.users || [];
  // Client-side filtering of admins (visual only - backend should handle security)
  const users = rawUsers.filter(u => !(u.role && String(u.role).toLowerCase() === "admin"));
  
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      if (data.error === false) setCountries(data.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryName) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName })
      });
      const data = await response.json();
      if (data.error === false) setStates(data.data.states);
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, state: stateName })
      });
      const data = await response.json();
      if (data.error === false) setCities(data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const formatUserForTable = (user) => ({
    id: user.id || user.uid,
    uid: user.uid,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
    email: user.email || "No email",
    phone: user.phone || "N/A",
    package: "Standard Package",
    joiningDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
      : "Unknown",
    status: user.isActive !== false ? "Active" : "Inactive",
    profilePicture: user.profilePicture,
    role: user.role,
  });

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
      phone: "", country: "", state: "", city: "", businessCategory: "",
    });
    setFormErrors({});
    setStates([]);
    setCities([]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address";
    
    if (!editingUser) {
        if (!formData.password) errors.password = "Password is required";
        else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    } else {
        if (formData.password && formData.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if (formData.password && formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setFormData(prev => ({ ...prev, [name]: value, state: "", city: "" }));
      setStates([]); setCities([]);
      if (value) fetchStates(value);
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, [name]: value, city: "" }));
      setCities([]);
      if (value && formData.country) fetchCities(formData.country, value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCloseModal = () => { resetForm(); setShowAddUserModal(false); };
  const handleCloseEditModal = () => { resetForm(); setEditingUser(null); setShowEditUserModal(false); };

  const handleUpdateAction = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingUser) {
        // Update Hook
        const updateData = {
          userId: editingUser.uid,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country,
          state: formData.state,
          city: formData.city,
          businessCategory: formData.businessCategory,
        };
        if (formData.password) updateData.password = formData.password;

        await updateUser(updateData).unwrap();
        showToast("User updated successfully!", "success");
        handleCloseEditModal();
      } else {
        // Register Hook
        const result = await registerUser({
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
        }).unwrap();

        showToast(`User created successfully${result.emailSent ? ` and credentials sent to ${result.user.email}` : ""}!`, "success");
        handleCloseModal();
      }
    } catch (err) {
      console.error("Action error:", err);
      showToast(err.data?.error || err.error || "Failed to process request", "error");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
    try {
      await deleteUser(userId).unwrap();
      showToast("User deleted successfully!", "success");
    } catch (err) {
      showToast(err.data?.error || "Failed to delete user", "error");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateStatus({ userId, isActive: newStatus === "Active" }).unwrap();
      showToast("Status updated successfully", "success");
    } catch (err) {
      showToast(err.data?.error || "Failed to update status", "error");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", confirmPassword: "",
      phone: user.phone || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      businessCategory: user.businessCategory || "",
    });
    if (user.country) {
      fetchStates(user.country);
      if (user.state) fetchCities(user.country, user.state);
    }
    setShowEditUserModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Inactive": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getAvatarColor = (index) => ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-green-500", "bg-indigo-500"][index % 6];

  const PaginationButton = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded border ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50 text-gray-700"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-[60] rounded-lg px-4 py-2 shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
      
      <Header title="User Management" icon={User} />

      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header Section */}
          <div className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold poppins-semibold">User Management</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1 poppins-regular">
                  Manage all users from your database.
                </p>
                {isFetching && !isLoading && <span className="text-xs text-blue-500 animate-pulse">Refreshing...</span>}
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

          {/* Content */}
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5B700] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" />
               <p>Error loading users: {error.data?.error || error.message}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first user.</p>
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
                      {["Name", "Email", "Phone", "Package", "Joining On", "Status", "Action"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
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
                                  src={formattedUser.profilePicture || `https://i.pravatar.cc/40?u=${formattedUser.email}`}
                                  alt={formattedUser.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                                />
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)} hidden`}>
                                  {getInitials(formattedUser.name)}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{formattedUser.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedUser.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedUser.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedUser.package}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedUser.joiningDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <select
                                value={formattedUser.status}
                                onChange={(e) => handleStatusChange(formattedUser.uid, e.target.value)}
                                className={`appearance-none px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-[#E5B700] ${getStatusStyle(formattedUser.status)}`}
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-3">
                              <button onClick={() => handleDeleteUser(formattedUser.uid, formattedUser.name)} className="text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleEditUser(user)} className="text-gray-400 hover:text-blue-600 transition-colors">
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

              {/* Tablet/Mobile View (Simplified) */}
              <div className="lg:hidden divide-y divide-gray-200">
                  {users.map((user, index) => {
                      const formattedUser = formatUserForTable(user);
                      return (
                        <div key={formattedUser.id} className="p-4 bg-white hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${getAvatarColor(index)}`}>
                                        {getInitials(formattedUser.name)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{formattedUser.name}</p>
                                        <p className="text-xs text-gray-500">{formattedUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     <button onClick={() => handleDeleteUser(formattedUser.uid, formattedUser.name)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                     <button onClick={() => handleEditUser(user)} className="text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4"/></button>
                                </div>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(formattedUser.status)}`}>{formattedUser.status}</span>
                                <span className="text-gray-500 text-xs">{formattedUser.joiningDate}</span>
                             </div>
                        </div>
                      )
                  })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <PaginationButton onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={!pagination.hasPrevPage}>
                            Previous
                        </PaginationButton>
                        <PaginationButton onClick={() => setCurrentPage(c => Math.min(pagination.totalPages, c + 1))} disabled={!pagination.hasNextPage}>
                            Next
                        </PaginationButton>
                    </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

       {/* Modal code - Assuming standard modal structure, simplified for brevity here but keeping form logic separate would be ideal */}
       {(showAddUserModal || showEditUserModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-bold mb-4">{showEditUserModal ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleUpdateAction} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                      </div>
                   </div>
                   <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                   </div>
                   {!editingUser && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                           </div>
                       </div>
                   )}
                   {editingUser && (
                        <div className="p-2 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200">
                            Leave password fields blank to keep current password.
                        </div>
                   )}
                   {editingUser && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                           </div>
                       </div>
                   )}
                   <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <select name="country" value={formData.country} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.country} value={c.country}>{c.country}</option>
                                ))}
                            </select>
                       </div>
                       <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <select name="state" value={formData.state} onChange={handleInputChange} disabled={!formData.country} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100">
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                       </div>
                       <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.state} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100">
                                <option value="">Select City</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                       </div>
                   </div>

                   <div>
                        <label className="block text-sm font-medium text-gray-700">Business Category</label>
                        <input name="businessCategory" value={formData.businessCategory} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                   </div>
                   
                   <div className="flex justify-end gap-3 mt-6">
                       <button type="button" onClick={showEditUserModal ? handleCloseEditModal : handleCloseModal} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                       <button type="submit" disabled={isRegistering || isUpdating} className="px-4 py-2 bg-[#E5B700] text-white rounded-md hover:bg-yellow-600">
                           {isRegistering || isUpdating ? 'Saving...' : (showEditUserModal ? 'Update User' : 'Add User')}
                       </button>
                   </div>
                </form>
            </div>
        </div>
       )}

    </div>
  );
};

export default UserManagement;