import React, { useState } from "react";
import { Menu,Settings , Search, Bell, ChevronDown } from "lucide-react";
import Header from "../components/Header";

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: false,
    walletSystem: true,
    autoApproveSupport: true,
    autoApproveTickets: true,
    adMonetization: true,
  });

  const [animatingKey, setAnimatingKey] = useState(null);

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Trigger animation
    setAnimatingKey(key);
    setTimeout(() => setAnimatingKey(null), 300);
  };

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 sm:h-7 lg:h-8 w-12 sm:w-14 lg:w-16 items-center rounded-full transition-all duration-300 ease-in-out transform active:scale-95 ${
        isOn
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
          : "bg-gray-300 hover:bg-gray-400"
      }`}
    >
      <span
        className={`inline-block h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 transform rounded-full bg-white transition-all duration-300 ease-in-out ${
          isOn
            ? "translate-x-7 sm:translate-x-8 lg:translate-x-9 rotate-180 scale-110"
            : "translate-x-1 rotate-0 scale-100"
        }`}
      >
        <span
          className={`block w-full h-full rounded-full transition-all duration-300 ${
            isOn
              ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
              : "bg-gradient-to-br from-gray-50 to-white"
          }`}
        />
      </span>
      <span
        className={`absolute inset-0 rounded-full ${
          isOn ? "bg-yellow-600" : "bg-gray-600"
        } opacity-0 active:opacity-20 transition-opacity duration-150`}
      />
    </button>
  );

  const settingsConfig = [
    {
      key: "maintenanceMode",
      title: "Enable Maintenance Mode",
      description: "Temporarily disables user access for updates or fixes.",
    },
    {
      key: "userRegistration",
      title: "User Registration",
      description: "Toggle to allow or restrict new sign-ups.",
    },
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Enable/disable system-generated email alerts to users.",
    },
    {
      key: "walletSystem",
      title: "Enable Wallet / Token System",
      description: "Activate token-based features or rewards.",
    },
    {
      key: "autoApproveSupport",
      title: "Auto Approve Support Tickets",
      description: "Temporarily disables user access for updates or fixes.",
    },
    {
      key: "autoApproveTickets",
      title: "Auto Approve Support Tickets",
      description: "Allow the system to auto-resolve common support issues.",
    },
    {
      key: "adMonetization",
      title: "Ad Monetization",
      description: "Control whether ads are served to end users.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="Security Settings" icon={Settings } />

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
            Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
            Configure security and system settings for your platform.
          </p>

          <div className="space-y-3 sm:space-y-4">
            {settingsConfig.map((setting) => (
              <div
                key={setting.key}
                className={`flex items-center justify-between p-3 sm:p-4 lg:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 ${
                  animatingKey === setting.key ? "scale-[0.99] bg-gray-100" : ""
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900">
                    {setting.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {setting.description}
                  </p>
                </div>
                <div className="ml-2 sm:ml-4">
                  <ToggleSwitch
                    isOn={settings[setting.key]}
                    onToggle={() => toggleSetting(setting.key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
