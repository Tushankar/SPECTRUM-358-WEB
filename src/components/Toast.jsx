// Toast component for notifications
import React from "react";

const Toast = ({ visible, message, type }) => {
  if (!visible) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-[60] rounded-lg px-4 py-2 shadow-lg text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
