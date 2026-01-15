import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  Menu,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import Header from "../../components/Header";
import { packageService } from "../../services/api";
import Toast from "../../components/Toast";
import RichTextEditor from "../../components/RichTextEditor";
import RichTextDisplay from "../../components/RichTextDisplay";

const PackageManagement = () => {
  const [showCreatePackageModal, setShowCreatePackageModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({
    activePackages: 0,
    totalPackages: 0,
    totalRevenue: "$0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createPackageData, setCreatePackageData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "1 month",
    packageLimit: "",
    storage: "",
    maxGroup: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

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

  // Fetch packages and stats on component mount
  useEffect(() => {
    fetchPackages();
    fetchStats();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log('Fetching packages...');
      const response = await packageService.getPackages();
      console.log('Package response:', response);
      
      setPackages(response.packages || []);
      if (response.stats) {
        setStats(response.stats);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      showToast(
        "Failed to load packages. Please check your connection and try again.",
        "error"
      );
      setError(
        "Failed to load packages. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await packageService.getPackageStats();
      setStats(response.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate required fields
      if (
        !createPackageData.name ||
        !createPackageData.price ||
        !createPackageData.description
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Ensure price is a valid number (allow 0 for demo packages)
      const price = parseFloat(createPackageData.price);
      if (isNaN(price) || price < 0) {
        setError("Please enter a valid price (0 or greater)");
        return;
      }

      const packageData = {
        ...createPackageData,
        price: price,
        packageLimit: createPackageData.packageLimit || null,
        storage: createPackageData.storage || 0,
        maxGroup: createPackageData.maxGroup || 0,
      };

      await packageService.createPackage(packageData);
      setShowCreatePackageModal(false);
      setCreatePackageData({
        name: "",
        description: "",
        price: "",
        duration: "1 month",
        packageLimit: "",
        storage: "",
        maxGroup: "",
      });
      setError(null);
      await fetchPackages();
      await fetchStats();
      showToast("Package created successfully");
    } catch (err) {
      console.error("Error creating package:", err);
      setError("Failed to create package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage({
      ...pkg,
      price: pkg.price.replace("$", ""), // Remove $ sign for editing
    });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const handleDeletePackage = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteConfirm(true);
    setOpenDropdown(null);
  };

  const confirmDeletePackage = async () => {
    if (!packageToDelete) return;

    try {
      setLoading(true);
      setError(null);

      console.log(
        "Deleting package:",
        packageToDelete.packageId || packageToDelete.id
      );

      const response = await packageService.deletePackage(
        packageToDelete.packageId || packageToDelete.id
      );

      console.log("Delete response:", response);

      await fetchPackages();
      await fetchStats();
      setShowDeleteConfirm(false);
      setPackageToDelete(null);

      // Show success message (optional)
      showToast("Package deleted successfully");
    } catch (err) {
      console.error("Error deleting package:", err);
      setError(`Failed to delete package: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    if (!editingPackage) return;

    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (
        !editingPackage.name ||
        !editingPackage.price ||
        !editingPackage.description
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Ensure price is a valid number (allow 0 for demo packages)
      const price = parseFloat(editingPackage.price);
      if (isNaN(price) || price < 0) {
        setError("Please enter a valid price (0 or greater)");
        return;
      }

      const updateData = {
        ...editingPackage,
        price: price,
        packageLimit: editingPackage.packageLimit || null,
        storage: editingPackage.storage || 0,
        maxGroup: editingPackage.maxGroup || 0,
      };

      console.log(
        "Updating package:",
        editingPackage.packageId || editingPackage.id,
        "with data:",
        updateData
      );

      const response = await packageService.updatePackage(
        editingPackage.packageId || editingPackage.id,
        updateData
      );

      console.log("Update response:", response);

      setShowEditModal(false);
      setEditingPackage(null);

      await fetchPackages();
      await fetchStats();

      showToast("Package updated successfully");
    } catch (err) {
      console.error("Error updating package:", err);
      setError(`Failed to update package: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (packageId) => {
    setOpenDropdown(openDropdown === packageId ? null : packageId);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title="Package Management" icon={Package} />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      {/* Package Management Content */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <PackageStatCard
            title="Active Packages"
            value={
              loading ? "..." : (stats.activePackages || 0).toString().padStart(2, "0")
            }
            icon={
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            }
          />
          <PackageStatCard
            title="Total Packages"
            value={loading ? "..." : (stats.totalPackages || 0).toLocaleString()}
            icon={<Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
          />
          <PackageStatCard
            title="Total Package Revenue"
            value={loading ? "..." : (stats.totalRevenue || "$0")}
            icon={
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            }
          />
        </div>

        {/* Package Table/Cards */}
        <div className="bg-white rounded-lg shadow overflow-visible">
          <div className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                  Package Management
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage your team members and their account permissions here.
                </p>
              </div>
              <button
                onClick={() => setShowCreatePackageModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto overflow-y-visible relative">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Limit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading packages...
                    </td>
                  </tr>
                ) : packages.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No packages found. Create your first package to get
                      started.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg, index) => (
                    <tr
                      key={pkg.packageId || pkg.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pkg.packageId || pkg.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pkg.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <RichTextDisplay
                          content={pkg.description}
                          maxLength={100}
                          className="text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {pkg.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pkg.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {pkg.totalUser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pkg.packageLimit || 'Unlimited'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="relative dropdown-container">
                          <button
                            onClick={() =>
                              toggleDropdown(pkg.packageId || pkg.id)
                            }
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openDropdown === (pkg.packageId || pkg.id) && (
                            <div className="absolute right-0 top-0 w-48 bg-white rounded-md shadow-xl z-[9999] border border-gray-200 transform -translate-y-full -translate-x-0">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditPackage(pkg)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Package
                                </button>
                                <button
                                  onClick={() => handleDeletePackage(pkg)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Package
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="divide-y divide-gray-200">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.packageId || pkg.id}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {pkg.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        ID: {pkg.packageId || pkg.id}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {pkg.price}
                      </p>
                    </div>
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => toggleDropdown(pkg.packageId || pkg.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === (pkg.packageId || pkg.id) && (
                        <div className="absolute right-0 top-0 w-48 bg-white rounded-md shadow-xl z-[9999] border border-gray-200 transform -translate-y-full -translate-x-0">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditPackage(pkg)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Package
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Package
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p className="mt-1">
                        {pkg.duration}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Total Users:</span>
                      <p className="mt-1 font-semibold text-gray-900">
                        {pkg.totalUser}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Limit:</span>
                      <p className="mt-1 text-gray-900">
                        {pkg.packageLimit || 'Unlimited'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="divide-y divide-gray-200">
              {packages.map((pkg, index) => (
                <div key={pkg.packageId || pkg.id} className="p-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {pkg.name}
                        </h4>
                        <div className="relative dropdown-container">
                          <button
                            onClick={() =>
                              toggleDropdown(pkg.packageId || pkg.id)
                            }
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdown === (pkg.packageId || pkg.id) && (
                            <div className="absolute right-0 top-0 w-48 bg-white rounded-md shadow-xl z-[9999] border border-gray-200 transform -translate-y-full -translate-x-0">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditPackage(pkg)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Package
                                </button>
                                <button
                                  onClick={() => handleDeletePackage(pkg)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Package
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Package ID:</span>
                      <span className="text-gray-900">
                        {pkg.packageId || pkg.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span className="font-semibold text-gray-900">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Users:</span>
                      <span className="font-semibold text-gray-900">
                        {pkg.totalUser}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="text-gray-900">
                        {pkg.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Limit:</span>
                      <span className="text-gray-900">
                        {pkg.packageLimit || 'Unlimited'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Package Modal */}
      {showCreatePackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowCreatePackageModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowCreatePackageModal(false)}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Create Package
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new package with pricing and validity details.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreatePackage} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Package Name"
                      value={createPackageData.name}
                      onChange={(e) =>
                        setCreatePackageData({
                          ...createPackageData,
                          name: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={createPackageData.price}
                        onChange={(e) =>
                          setCreatePackageData({
                            ...createPackageData,
                            price: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description *
                  </label>
                  <RichTextEditor
                    value={createPackageData.description}
                    onChange={(value) =>
                      setCreatePackageData({
                        ...createPackageData,
                        description: value,
                      })
                    }
                    placeholder="Enter Package Description with rich formatting..."
                    height={150}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      value={createPackageData.duration}
                      onChange={(e) =>
                        setCreatePackageData({
                          ...createPackageData,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-900 text-sm"
                    >
                      <option value="2 days">2 Days</option>
                      <option value="1 week">1 Week</option>
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                      <option value="2 years">2 Years</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Package Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      value={createPackageData.packageLimit}
                      onChange={(e) =>
                        setCreatePackageData({
                          ...createPackageData,
                          packageLimit: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Storage (MB)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={createPackageData.storage}
                      onChange={(e) =>
                        setCreatePackageData({
                          ...createPackageData,
                          storage: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Groups
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={createPackageData.maxGroup}
                      onChange={(e) =>
                        setCreatePackageData({
                          ...createPackageData,
                          maxGroup: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors text-sm order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Package"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreatePackageModal(false)}
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

      {/* Edit Package Modal */}
      {showEditModal && editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Edit Package
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update package details and pricing information.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdatePackage} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Package Name"
                      value={editingPackage.name}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          name: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={editingPackage.price}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            price: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description *
                  </label>
                  <RichTextEditor
                    value={editingPackage.description}
                    onChange={(value) =>
                      setEditingPackage({
                        ...editingPackage,
                        description: value,
                      })
                    }
                    placeholder="Enter Package Description with rich formatting..."
                    height={150}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      value={editingPackage.duration}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent appearance-none text-gray-900 text-sm"
                    >
                      <option value="2 days">2 Days</option>
                      <option value="1 week">1 Week</option>
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                      <option value="2 years">2 Years</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Package Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      value={editingPackage.packageLimit || ''}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          packageLimit: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Storage (MB)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={editingPackage.storage || ''}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          storage: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Groups
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={editingPackage.maxGroup || ''}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          maxGroup: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] focus:border-transparent placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-[#F5A623] text-white font-medium rounded-lg hover:bg-[#E59613] transition-colors text-sm order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Package"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Package
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{packageToDelete.name}"? This
                  action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePackage}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Package Stat Card Component - Made responsive
const PackageStatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#011F3F] rounded-lg p-3 sm:p-4 lg:p-6 relative overflow-hidden h-20 sm:h-24 lg:h-28">
      <svg
        width="140"
        height="140"
        viewBox="0 0 396 406"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -right-16 sm:-right-20 top-1/2 -translate-y-1/2 opacity-80"
      >
        <g opacity="0.5">
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

export default PackageManagement;