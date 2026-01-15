import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, Upload, Users } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    console.log("SettingsPage: User data from AuthContext:", user);
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || null,
      });
      setIsLoading(false);
    } else {
      // Still loading user data
      setIsLoading(true);
    }
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const handleSaveChanges = async () => {
    try {
      // Show loading state
      const saveButton = document.querySelector("[data-save-button]");
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
      }

      // Validate required fields
      if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
        showToast("First name and last name are required", "error");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        showToast("Please enter a valid email address", "error");
        return;
      }

      const result = await updateUserProfile(profileData);
      if (result.success) {
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Failed to update profile: " + result.error, "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("An error occurred while updating your profile.", "error");
    } finally {
      // Reset button state
      const saveButton = document.querySelector("[data-save-button]");
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save changes";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Profile" icon={Users} />
        <div className="p-4 sm:p-6 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-y-auto">
      {/* Header */}
      <Header title="Profile" icon={Users} />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      {/* Profile Content */}
      <div className="p-4 sm:p-6 lg:p-6 pb-20">
        <div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header with Gradient Background */}
            <div
              className="relative h-24 sm:h-28 lg:h-32 flex items-end px-4 sm:px-6 lg:px-8 pb-0"
              style={{
                background: "linear-gradient(to right, #FFE88B, #C8A000)",
              }}
            ></div>

            {/* Profile Info Section */}
            <div className="px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12">
              <div className="flex items-end space-x-3 sm:space-x-4 pb-4 sm:pb-6">
                <div className="relative">
                  <img
                    src={
                      user?.profilePicture ||
                      profileData.profilePicture ||
                      `https://i.pravatar.cc/150?u=${user?.email || "default"}`
                    }
                    alt="Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <button
                    onClick={() =>
                      document.getElementById("profile-picture-input").click()
                    }
                    className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 rounded-full p-1.5 shadow-lg transition-colors"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-8 sm:mt-10 lg:mt-12">
                    {user?.displayName ||
                      `${user?.firstName || ""} ${
                        user?.lastName || ""
                      }`.trim() ||
                      user?.email?.split("@")[0] ||
                      "User"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {user?.email || profileData.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="relative">
                    <select className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm pr-10 appearance-none cursor-pointer min-w-[120px]">
                      <option>Language</option>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Personal Info
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Update your photo and personal details.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Profile Photo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors cursor-pointer relative">
                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            showToast(
                              "File size must be less than 5MB",
                              "error"
                            );
                            return;
                          }

                          // Validate file type
                          if (!file.type.startsWith("image/")) {
                            showToast(
                              "Please select a valid image file",
                              "error"
                            );
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setProfileData({
                              ...profileData,
                              profilePicture: event.target.result,
                            });
                          };
                          reader.onerror = () => {
                            showToast("Error reading file", "error");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="text-yellow-600 font-medium hover:text-yellow-700">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-3 sm:px-4 py-2 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    data-save-button
                    className="px-3 sm:px-4 py-2 bg-yellow-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
