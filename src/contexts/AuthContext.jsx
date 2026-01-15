import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage on component mount
    try {
      const userData =
        localStorage.getItem("spectrum_user") ||
        sessionStorage.getItem("spectrum_user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === "admin") {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize auth state based on user state
    try {
      const userData =
        localStorage.getItem("spectrum_user") ||
        sessionStorage.getItem("spectrum_user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.role === "admin";
      }
    } catch (error) {
      console.error("Error parsing stored auth data:", error);
    }
    return false;
  });

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check both localStorage and sessionStorage for user data
      let userData =
        localStorage.getItem("spectrum_user") ||
        sessionStorage.getItem("spectrum_user");
      if (userData) {
        let parsedUser;
        try {
          parsedUser = JSON.parse(userData);
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
          localStorage.removeItem("spectrum_user");
          sessionStorage.removeItem("spectrum_user");
          return;
        }

        // ADMIN-ONLY RESTRICTION: Check if user is admin
        if (parsedUser.role !== "admin") {
          console.warn("Non-admin user found in storage, removing...");
          localStorage.removeItem("spectrum_user");
          sessionStorage.removeItem("spectrum_user");
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        // Set user immediately to prevent UI flicker
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Try to validate user data with server (optional validation)
        try {
          const response = await authService.getProfile(parsedUser.uid);
          if (response.user) {
            // Ensure firstName and lastName are properly set
            const firstName = response.user.firstName?.trim() || "";
            const lastName = response.user.lastName?.trim() || "";

            const validatedUser = {
              uid: response.user.uid,
              email: response.user.email,
              firstName: firstName,
              lastName: lastName,
              profilePicture: response.user.profilePicture || null,
              role: response.user.role || "user",
              isActive: response.user.isActive,
            };

            // Double-check admin role from server
            if (validatedUser.role !== "admin") {
              console.warn(
                "User is not admin according to server, logging out..."
              );
              localStorage.removeItem("spectrum_user");
              sessionStorage.removeItem("spectrum_user");
              setUser(null);
              setIsAuthenticated(false);
              return;
            }

            // Update user with fresh data from server
            setUser(validatedUser);
            setIsAuthenticated(true);
            // Update localStorage with latest user data
            localStorage.setItem(
              "spectrum_user",
              JSON.stringify(validatedUser)
            );
          } else {
            // If server doesn't return user data, user might be deleted
            console.warn("User not found on server, logging out...");
            localStorage.removeItem("spectrum_user");
            sessionStorage.removeItem("spectrum_user");
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (validationError) {
          console.error(
            "User validation failed (keeping local user):",
            validationError
          );
          // Don't remove user data on validation errors - keep them logged in
          // This handles cases like temporary network issues or server downtime
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Don't remove user data on general errors - they might be temporary
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.user) {
        // Ensure firstName and lastName are properly set
        const firstName = response.user.firstName?.trim() || "";
        const lastName = response.user.lastName?.trim() || "";

        const userData = {
          uid: response.user.uid,
          email: response.user.email,
          firstName: firstName,
          lastName: lastName,
          profilePicture: response.user.profilePicture || null,
          role: response.user.role || "user",
          isActive: response.user.isActive !== false, // Default to true if not specified
        };

        // Validate that user account is active
        if (userData.isActive === false) {
          return {
            success: false,
            error: "Account is deactivated. Please contact administrator.",
          };
        }

        // ADMIN-ONLY RESTRICTION: Only allow admin users to login
        if (userData.role !== "admin") {
          return {
            success: false,
            error:
              "Permission denied. Only administrators can access this system.",
          };
        }

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("spectrum_user", JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email,
    password,
    firstName,
    lastName,
    profilePicture = null,
    role = "user"
  ) => {
    try {
      setLoading(true);
      const response = await authService.register(
        email,
        password,
        firstName,
        lastName,
        profilePicture,
        role
      );

      if (response.user) {
        const userData = {
          uid: response.user.uid,
          email: response.user.email,
          firstName: response.user.firstName || firstName,
          lastName: response.user.lastName || lastName,
          displayName:
            response.user.displayName || `${firstName} ${lastName}`.trim(),
          profilePicture: response.user.profilePicture || profilePicture,
          role: response.user.role || role,
          isActive: response.user.isActive !== false,
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("spectrum_user", JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin register user (for admin use only)
  const adminRegisterUser = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.adminRegisterUser(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error("Admin registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("spectrum_user");
      sessionStorage.removeItem("spectrum_user");
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: "No user logged in" };

      const response = await authService.updateProfile(user.uid, updates);

      if (response.message) {
        // Check if response includes updated user data
        if (response.user) {
          // Use the user data from the response
          const updatedUser = {
            uid: response.user.uid,
            email: response.user.email,
            firstName: response.user.firstName || "",
            lastName: response.user.lastName || "",
            displayName: `${response.user.firstName || ""} ${
              response.user.lastName || ""
            }`.trim(),
            profilePicture: response.user.profilePicture || null,
            role: response.user.role || user.role,
            isActive: response.user.isActive !== false,
          };
          setUser(updatedUser);
          localStorage.setItem("spectrum_user", JSON.stringify(updatedUser));
          return { success: true, user: updatedUser };
        } else {
          // Fallback: Get updated user data from server
          const profileResponse = await authService.getProfile(user.uid);
          if (profileResponse.user) {
            const updatedUser = {
              uid: profileResponse.user.uid,
              email: profileResponse.user.email,
              firstName: profileResponse.user.firstName || "",
              lastName: profileResponse.user.lastName || "",
              displayName: `${profileResponse.user.firstName || ""} ${
                profileResponse.user.lastName || ""
              }`.trim(),
              profilePicture: profileResponse.user.profilePicture || null,
              role: profileResponse.user.role || user.role,
              isActive: profileResponse.user.isActive !== false,
            };
            setUser(updatedUser);
            localStorage.setItem("spectrum_user", JSON.stringify(updatedUser));
            return { success: true, user: updatedUser };
          }
        }
      }
      return { success: false, error: "Failed to update profile" };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message };
    }
  };

  // Role-based helper functions
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const isUser = () => {
    return user && user.role === "user";
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const isAccountActive = () => {
    return user && user.isActive !== false;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    adminRegisterUser,
    logout,
    updateUserProfile,
    checkAuthStatus,
    isAdmin,
    isUser,
    hasRole,
    isAccountActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
