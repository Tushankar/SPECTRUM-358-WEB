import React, { useState, useEffect } from "react";
import teamLogo from "../../src/assets/Spectrum3581.png";
import cloudImage from "../../src/assets/Asset4@4x3_2.png";
import rocketImage from "../../src/assets/Saly-43@2x.png";



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [rocketLaunched, setRocketLaunched] = useState(false);
  const [cloudsParting, setCloudsParting] = useState({});

  useEffect(() => {
    // Start rocket launch animation on page load
    const launchTimer = setTimeout(() => {
      setRocketLaunched(true);
    }, 100);

    // Trigger cloud parting effects at specific times during rocket ascent
    const cloudTimers = [
      setTimeout(() => setCloudsParting(prev => ({ ...prev, bottom: true })), 400),
      setTimeout(() => setCloudsParting(prev => ({ ...prev, middle: true })), 600),
      setTimeout(() => setCloudsParting(prev => ({ ...prev, top: true })), 800),
      setTimeout(() => setCloudsParting(prev => ({ ...prev, final: true })), 1000),
    ];

    return () => {
      clearTimeout(launchTimer);
      cloudTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      console.log("Login attempt:", { email, password, rememberMe });
      alert("Login successful!");
    } else {
      alert("Please enter both email and password");
    }
  };

  // Cloud image component with animation - Clear/Opaque clouds
  const CloudImage = ({
    className = "",
    style = {},
    animationType = "float",
    isParting = false,
  }) => (
    <img
      src={cloudImage}
      alt="Cloud"
      className={`w-full h-full object-contain ${className} ${animationType} ${isParting ? 'cloud-parting' : ''}`}
      style={style}
    />
  );

  // Rocket image component with animation
  const RocketImage = ({
    className = "",
    style = {},
    animationType = "float",
  }) => (
    <img
      src={rocketImage}
      alt="Rocket"
      className={`w-full h-full object-contain ${className} ${animationType}`}
      style={style}
    />
  );

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rocketLaunch {
          from {
            transform: translateX(-50%) translateY(100vh);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        @keyframes cloudRise {
          from {
            transform: translateY(100vh);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes cloudPart {
          0% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8) translateX(20px);
          }
          100% {
            opacity: 0;
            transform: scale(0.6) translateX(40px);
          }
        }

        @keyframes cloudPartLeft {
          0% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8) translateX(-20px);
          }
          100% {
            opacity: 0;
            transform: scale(0.6) translateX(-40px);
          }
        }

        @keyframes cloudFadeBack {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .rocket-launching {
          animation: rocketLaunch 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .cloud-parting {
          animation: cloudPart 0.8s ease-out forwards;
        }

        .cloud-parting-left {
          animation: cloudPartLeft 0.8s ease-out forwards;
        }

        .cloud-fade-back {
          animation: cloudFadeBack 1s ease-in 1.5s forwards;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(0px) translateX(10px);
          }
          75% {
            transform: translateY(-5px) translateX(5px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-8px) translateX(8px);
          }
          66% {
            transform: translateY(-3px) translateX(-3px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(-8px);
          }
          50% {
            transform: translateY(0px) translateX(-15px);
          }
          75% {
            transform: translateY(-4px) translateX(-8px);
          }
        }

        @keyframes drift {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-12px) translateX(6px) rotate(1deg);
          }
          50% {
            transform: translateY(-6px) translateX(12px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) translateX(6px) rotate(-1deg);
          }
        }

        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes rocketFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) translateX(8px) rotate(2deg);
          }
          50% {
            transform: translateY(-8px) translateX(15px) rotate(0deg);
          }
          75% {
            transform: translateY(-20px) translateX(8px) rotate(-2deg);
          }
        }

        @keyframes rocketHover {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        /* Cloud containers that rise from below */
        .cloud-container-1 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }
        .cloud-container-2 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
        }
        .cloud-container-3 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }
        .cloud-container-4 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.25s forwards;
        }
        .cloud-container-5 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }
        .cloud-container-6 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards;
        }
        .cloud-container-7 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
        }
        .cloud-container-8 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.45s forwards;
        }
        .cloud-container-9 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
        }
        .cloud-container-10 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.55s forwards;
        }
        .cloud-container-11 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
        }
        .cloud-container-12 {
          transform: translateY(100vh);
          opacity: 0;
          animation: cloudRise 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.65s forwards;
        }

        .float {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .float-slow {
          animation: floatSlow 8s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .float-reverse {
          animation: floatReverse 7s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .drift {
          animation: drift 9s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .gentle-float {
          animation: gentleFloat 4s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .rocket-float {
          animation: rocketFloat 10s ease-in-out infinite;
        }

        .rocket-hover {
          animation: rocketHover 5s ease-in-out infinite;
        }

        .float-delay-1 {
          animation-delay: 1s;
        }

        .float-delay-2 {
          animation-delay: 2s;
        }

        .float-delay-3 {
          animation-delay: 3s;
        }

        .float-delay-4 {
          animation-delay: 4s;
        }

        /* Custom styles for rounded inputs */
        .rounded-input {
          border-radius: 1.625rem !important;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-reduced-animation .float,
          .mobile-reduced-animation .float-slow,
          .mobile-reduced-animation .float-reverse,
          .mobile-reduced-animation .drift,
          .mobile-reduced-animation .gentle-float,
          .mobile-reduced-animation .rocket-float,
          .mobile-reduced-animation .rocket-hover {
            animation-duration: 8s;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col md:flex-row mobile-reduced-animation relative">
        {/* Logo - Positioned absolute top left */}
        <h1
          className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xl sm:text-2xl font-bold poppins-bold z-50"
          style={{ color: "#E5B700" }}
        >
          Spectrum 358
        </h1>

        {/* Copyright - Positioned absolute bottom left */}
        <p
          className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-sm poppins-regular"
          style={{ 
            color: "#666666",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: "1.25rem",
            zIndex: 100
          }}
        >
          © Spectrum358 2025
        </p>

        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Login Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 poppins-bold">
                Log in
              </h2>
              <p className="text-sm sm:text-base text-gray-600 poppins-regular">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email address"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base rounded-input"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10 text-sm sm:text-base rounded-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          showPassword
                            ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        }
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: "#E5B700" }}
                  />
                  <span className="ml-2 text-gray-600 text-xs sm:text-sm">
                    Remember for 30 days
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs sm:text-sm hover:underline"
                  style={{ color: "#E5B700" }}
                >
                  Forgot password
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-2.5 sm:py-3 px-4 text-white font-semibold hover:opacity-90 transition duration-200 text-sm sm:text-base"
                style={{
                  background: "linear-gradient(to right, #E5B700, #DE8806)",
                  borderRadius: "1.625rem",
                }}
              >
                Login
              </button>

              {/* Or continue with */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 text-white hover:bg-gray-800 transition duration-200 font-medium text-sm sm:text-base"
                  style={{ borderRadius: "1.625rem" }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white hover:bg-blue-700 transition duration-200 font-medium text-sm sm:text-base"
                  style={{ borderRadius: "1.625rem" }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Illustration with Clear Animated Clouds */}
        <div
          className="hidden md:flex w-full md:w-1/2 relative overflow-hidden items-center justify-center min-h-[400px] lg:min-h-0"
          style={{
            background: "linear-gradient(135deg, #E5B700 0%, #DE8806 100%)",
          }}
        >
          {/* Background Clouds Layer - Clear/Opaque */}
          <div className="absolute inset-0 hidden md:block">
            {/* Top left cloud */}
            <div className={`absolute top-8 left-12 w-24 lg:w-32 h-15 lg:h-20 cloud-container-1 ${cloudsParting.top ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage animationType="float float-delay-1" />
            </div>

            {/* Top right cloud */}
            <div className={`absolute top-16 right-8 w-27 lg:w-36 h-16 lg:h-22 cloud-container-2 ${cloudsParting.top ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage animationType="float-slow float-delay-2" />
            </div>

            {/* Bottom left cloud */}
            <div className={`absolute bottom-20 left-16 w-30 lg:w-40 h-18 lg:h-24 cloud-container-3 ${cloudsParting.bottom ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage animationType="drift float-delay-3" />
            </div>

            {/* Bottom right cloud */}
            <div className={`absolute bottom-12 right-20 w-21 lg:w-28 h-12 lg:h-16 cloud-container-4 ${cloudsParting.bottom ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage animationType="float-reverse float-delay-4" />
            </div>
          </div>

          {/* Clouds positioned behind the card (will show through transparent card) */}
          <div className="absolute inset-0 z-5">
            {/* Behind card clouds - positioned to show through transparent card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Center cloud behind card */}
              <div className={`absolute -top-8 -left-12 w-24 lg:w-32 h-14 lg:h-18 cloud-container-5 ${cloudsParting.middle ? 'cloud-parting-left cloud-fade-back' : ''}`}>
                <CloudImage animationType="gentle-float float-delay-3" />
              </div>

              {/* Bottom center cloud behind card */}
              <div className={`absolute top-16 left-8 w-20 lg:w-26 h-12 lg:h-16 cloud-container-6 ${cloudsParting.middle ? 'cloud-parting cloud-fade-back' : ''}`}>
                <CloudImage animationType="float-slow float-delay-4" />
              </div>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="relative z-10">
            {/* Clouds positioned exactly like your reference image */}

            {/* Top left cloud - positioned like in your image */}
            <div className={`absolute -top-16 -left-20 w-28 lg:w-36 h-17 lg:h-22 cloud-container-7 ${cloudsParting.final ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="drift"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Top right cloud - positioned like in your image */}
            <div className={`absolute -top-12 -right-24 w-32 lg:w-42 h-19 lg:h-25 cloud-container-8 ${cloudsParting.final ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float-slow float-delay-1"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Left side cloud - positioned like in your image */}
            <div className={`absolute top-1/2 -left-24 -translate-y-1/2 w-24 lg:w-32 h-14 lg:h-18 cloud-container-9 ${cloudsParting.middle ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="gentle-float float-delay-4"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Right side cloud - positioned like in your image */}
            <div className={`absolute top-1/3 -right-20 w-22 lg:w-28 h-13 lg:h-17 cloud-container-10 ${cloudsParting.middle ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="drift float-delay-1"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Bottom left cloud - positioned like in your image */}
            <div className={`absolute -bottom-18 -left-16 w-34 lg:w-44 h-20 lg:h-26 cloud-container-11 ${cloudsParting.bottom ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float float-delay-2"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Bottom right cloud - positioned like in your image */}
            <div className={`absolute -bottom-14 -right-18 w-26 lg:w-34 h-16 lg:h-20 cloud-container-12 ${cloudsParting.bottom ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float-reverse float-delay-3"
                style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Small top cloud - like in your image */}
            <div className={`absolute -top-8 left-1/4 w-16 lg:w-20 h-10 lg:h-12 cloud-container-1 ${cloudsParting.top ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float-slow float-delay-3"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
              />
            </div>

            {/* Rocket positioned above the glass card - slightly right of center */}
            <div className={`absolute -top-32 left-1/2 transform -translate-x-1/4 w-18 lg:w-28 h-22 lg:h-35 z-30 ${rocketLaunched ? 'rocket-launching' : ''}`}
              style={{
                transform: rocketLaunched ? '' : 'translateX(-50%) translateY(100vh)',
                opacity: rocketLaunched ? '' : '0',
              }}
            >
              <RocketImage
                animationType="rocket-float float-delay-2"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                  width: "240px",
                  height: "240px",
                }}
              />
            </div>

            {/* Glass Card - More transparent to show clouds behind */}
            <div className="relative bg-white/15 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl w-[350px] lg:w-[450px] h-[350px] lg:h-[450px] overflow-visible">
              {/* Main content */}
              <div className="flex flex-col items-center justify-center h-full p-8 lg:p-10 relative z-20">
                {/* Team illustration */}
                <div className="w-48 lg:w-64 h-48 lg:h-64 mb-6 lg:mb-8 relative z-10">
                  <img
                    src={teamLogo}
                    alt="Spectrum 358 Logo"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>

                {/* SPECTRUM 358 Text */}
                <h2 className="text-white text-2xl lg:text-4xl font-bold tracking-wider drop-shadow-xl relative z-10 text-center">
                  SPECTRUM 358
                </h2>

                {/* Small cloud inside card bottom - positioned like in your image */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 lg:w-18 h-8 lg:h-11 cloud-container-2">
                  <CloudImage animationType="gentle-float float-delay-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Foreground Clouds - All Clear/Opaque */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{ zIndex: 20 }}
          >
            {/* Top right foreground cloud */}
            <div className={`absolute top-8 right-12 w-22 lg:w-28 h-13 lg:h-17 cloud-container-3 ${cloudsParting.top ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float-reverse float-delay-1"
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))" }}
              />
            </div>

            {/* Bottom right foreground cloud */}
            <div className={`absolute bottom-24 right-8 w-26 lg:w-34 h-16 lg:h-20 cloud-container-4 ${cloudsParting.middle ? 'cloud-parting cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="drift float-delay-3"
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))" }}
              />
            </div>

            {/* Bottom left foreground cloud */}
            <div className={`absolute bottom-6 left-16 w-28 lg:w-36 h-17 lg:h-22 cloud-container-5 ${cloudsParting.bottom ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="float-slow float-delay-4"
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))" }}
              />
            </div>

            {/* Top left foreground cloud */}
            <div className={`absolute top-20 left-6 w-20 lg:w-26 h-12 lg:h-16 cloud-container-6 ${cloudsParting.middle ? 'cloud-parting-left cloud-fade-back' : ''}`}>
              <CloudImage
                animationType="gentle-float float-delay-2"
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;