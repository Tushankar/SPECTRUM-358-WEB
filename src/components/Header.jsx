import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

// ProfileDropdown component for dropdown menu with logout button
const ProfileDropdown = ({ isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 px-2 py-1 rounded-[1.5rem] bg-[rgba(212,212,212,0.3)] focus:outline-none ${
          isMobile
            ? "w-full h-[2.25rem] justify-center"
            : "w-[11.5rem] h-[2.5rem] lg:w-[11.5rem] lg:h-[2.5rem] md:w-[10rem] md:h-[2.25rem] sm:w-[8rem] sm:h-[2rem]"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {user ? (
          <img
            src={
              user.profilePicture || `https://i.pravatar.cc/40?u=${user.email}`
            }
            alt="profile"
            className={`rounded-full object-cover ${
              isMobile ? "w-6 h-6" : "w-8 h-8 sm:w-6 sm:h-6 md:w-7 md:h-7"
            }`}
          />
        ) : (
          <div
            className={`rounded-full bg-gray-300 flex items-center justify-center ${
              isMobile ? "w-6 h-6" : "w-8 h-8 sm:w-6 sm:h-6 md:w-7 md:h-7"
            }`}
          >
            <User
              className={`text-gray-600 ${
                isMobile ? "w-3 h-3" : "w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4"
              }`}
            />
          </div>
        )}
        {!isMobile && user && (
          <span className="whitespace-nowrap text-sm font-medium text-black hidden sm:inline lg:inline">
            {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email.split("@")[0]}
          </span>
        )}
        {!isMobile && user && (
          <span className="whitespace-nowrap text-xs font-medium text-black sm:hidden">
            {user.firstName || user.lastName || user.email.split("@")[0]}
          </span>
        )}
        <ChevronDown
          className={`text-black ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
        />
      </button>
      {open && (
        <div
          className={`absolute ${
            isMobile ? "left-0" : "right-0"
          } mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50`}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
            onClick={async () => {
              setOpen(false);
              await logout();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Header = ({ title, icon: Icon }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Debug user data
  console.log("Header: User data from AuthContext:", user);

  return (
    <>
      {/* Desktop & Tablet Header */}
      <div className="w-full flex justify-between items-center px-3 sm:px-4 md:px-6 lg:px-10 py-3 bg-white">
        {/* Left section: Icon + Title - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="text-xs sm:text-sm font-medium truncate">
            {title}
          </span>
        </div>

        {/* Mobile: Centered Icon + Title */}
        <div className="flex md:hidden items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-xs font-medium truncate">{title}</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Right section: Search, Bell, Profile - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 w-[8rem] sm:w-[10rem] md:w-[11rem] lg:w-[12.5rem] h-[1.75rem] sm:h-[2rem] lg:h-[2.25rem] px-2 py-1 rounded-[1.5rem] bg-[rgba(0,0,0,0.04)]">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-xs sm:text-sm outline-none w-full placeholder:text-gray-500"
            />
          </div>

          {/* Notification Icon */}
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer hover:text-gray-600 transition-colors" />

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="flex items-center gap-2 w-full h-[2.25rem] px-3 py-1 rounded-[1.5rem] bg-[rgba(0,0,0,0.04)]">
                <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-sm outline-none w-full placeholder:text-gray-500"
                />
              </div>

              {/* Mobile Notifications */}
              <button className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-black" />
                <span className="text-sm font-medium">Notifications</span>
              </button>

              {/* Mobile Profile Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-3">
                  {user ? (
                    <img
                      src={`https://i.pravatar.cc/40?u=${user.email}`}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-black">
                      {user
                        ? `${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim() || user.email.split("@")[0]
                        : "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user
                        ? (user.role || "User").charAt(0).toUpperCase() +
                          (user.role || "User").slice(1)
                        : "Not logged in"}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
