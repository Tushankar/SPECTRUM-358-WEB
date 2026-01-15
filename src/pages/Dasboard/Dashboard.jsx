import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  FileText,
  Home,
} from "lucide-react";
import Header from "../../components/Header";
import { ticketService, authService } from "../../services/api";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("12 months");
  const [daysFilter, setDaysFilter] = useState("This month");
  const [chartDays, setChartDays] = useState("7 days");
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    active: 0,
    closed: 0,
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  // Sample chart data - unchanged
  const chartData = [
    { month: "Jan", total: 10000, active: 8000 },
    { month: "Feb", total: 12000, active: 9000 },
    { month: "Mar", total: 13000, active: 9500 },
    { month: "Apr", total: 15000, active: 10000 },
    { month: "May", total: 17000, active: 11000 },
    { month: "Jun", total: 19000, active: 11500 },
    { month: "Jul", total: 20000, active: 12000 },
    { month: "Aug", total: 19500, active: 12500 },
    { month: "Sep", total: 20500, active: 13000 },
    { month: "Oct", total: 21000, active: 13000 },
    { month: "Nov", total: 22000, active: 13500 },
    { month: "Dec", total: 23000, active: 14000 },
  ];

  const notifications = [
    {
      id: 1,
      user: "Martin William",
      action: "Redeem $50 from token balance",
      time: "05 min ago",
      avatar: "1507003211169-0a1dd7228f2d",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "Created new support ticket",
      time: "12 min ago",
      avatar: "1438761681033-6461ffad8d80",
    },
    {
      id: 3,
      user: "Alex Chen",
      action: "Updated account settings",
      time: "25 min ago",
      avatar: "1472099645785-5658abf4ff4e",
    },
    {
      id: 4,
      user: "Emma Davis",
      action: "Completed onboarding process",
      time: "1 hour ago",
      avatar: "1507591064344-4c6ce005b128",
    },
    {
      id: 5,
      user: "Michael Brown",
      action: "Upgraded to premium plan",
      time: "2 hours ago",
      avatar: "1438761681033-6461ffad8d80",
    },
  ];

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ticket stats
        const ticketData = await ticketService.getStats();
        setTicketStats({
          total: ticketData.total || 0,
          active: ticketData.active || 0,
          closed: ticketData.closed || 0,
        });

        // Fetch user stats
        const userData = await authService.getUserStats();
        setUserStats({
          totalUsers: userData.stats?.totalUsers || 0,
          activeUsers: userData.stats?.activeUsers || 0,
          inactiveUsers: userData.stats?.inactiveUsers || 0,
        });
      } catch (e) {
        console.error("Error fetching stats:", e);
        // Optionally handle error
      }
    };
    fetchStats();
  }, []);

  // Dashboard SVG icon as a component
  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M6.875 3.75V16.25H3.125C2.95924 16.25 2.80027 16.1842 2.68306 16.0669C2.56585 15.9497 2.5 15.7908 2.5 15.625V4.375C2.5 4.20924 2.56585 4.05027 2.68306 3.93306C2.80027 3.81585 2.95924 3.75 3.125 3.75H6.875Z"
        fill="black"
        fillOpacity="0.04"
      />
      <path
        d="M16.875 3.125H3.125C2.79348 3.125 2.47554 3.2567 2.24112 3.49112C2.0067 3.72554 1.875 4.04348 1.875 4.375V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V4.375C18.125 4.04348 17.9933 3.72554 17.7589 3.49112C17.5245 3.2567 17.2065 3.125 16.875 3.125ZM3.125 11.875H4.375C4.54076 11.875 4.69973 11.8092 4.81694 11.6919C4.93415 11.5747 5 11.4158 5 11.25C5 11.0842 4.93415 10.9253 4.81694 10.8081C4.69973 10.6908 4.54076 10.625 4.375 10.625H3.125V9.375H4.375C4.54076 9.375 4.69973 9.30915 4.81694 9.19194C4.93415 9.07473 5 8.91576 5 8.75C5 8.58424 4.93415 8.42527 4.81694 8.30806C4.69973 8.19085 4.54076 8.125 4.375 8.125H3.125V6.875H4.375C4.54076 6.875 4.69973 6.80915 4.81694 6.69194C4.93415 6.57473 5 6.41576 5 6.25C5 6.08424 4.93415 5.92527 4.81694 5.80806C4.69973 5.69085 4.54076 5.625 4.375 5.625H3.125V4.375H6.25V15.625H3.125V11.875ZM16.875 15.625H7.5V4.375H16.875V15.625Z"
        fill="black"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="Dashboard" icon={DashboardIcon} />

      {/* Dashboard Content */}
      <div className="p-3 sm:p-4 md:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            title="Total User"
            value={userStats.totalUsers.toLocaleString()}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B700]" />}
            bgColor="bg-[#011F3F]"
          />
          <StatCard
            title="Active User"
            value={userStats.activeUsers.toLocaleString()}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B700]" />}
            bgColor="bg-[#011F3F]"
          />
          <StatCard
            title="Total Ticket"
            value={ticketStats.total}
            icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B700]" />}
            bgColor="bg-[#011F3F]"
          />
          <StatCard
            title="Active Ticket"
            value={ticketStats.active}
            icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B700]" />}
            bgColor="bg-[#011F3F]"
          />
          <StatCard
            title="Close Ticket"
            value={ticketStats.closed}
            icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B700]" />}
            bgColor="bg-[#011F3F]"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Chart Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Onboarding User Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
              {/* Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-3 gap-3">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Onboarding User
                </h3>
                <div className="flex items-center space-x-2 w-full lg:w-auto">
                  {/* Time Filters */}
                  <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 flex-1 lg:flex-initial">
                    {["12 months", "30 days", "7 days"].map((filter, index) => (
                      <button
                        key={filter}
                        onClick={() => setTimeFilter(filter)}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex-1 lg:flex-initial min-w-[80px] ${
                          timeFilter === filter
                            ? "text-white rounded-full shadow-sm"
                            : "bg-transparent text-gray-600 hover:text-gray-800"
                        } ${
                          index < 2
                            ? "border-r border-[var(--Colors-Border-border-primary,#D0D5DD)]"
                            : ""
                        }`}
                        style={
                          timeFilter === filter
                            ? {
                                background:
                                  "linear-gradient(168deg, #E5B700 0%, #DE8806 100%)",
                              }
                            : {}
                        }
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  {/* Menu Icon */}
                  <button className="p-2 flex-shrink-0">
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Subheading */}
              <p className="text-sm text-gray-500 mb-4 pb-3 border-b border-gray-200">
                Compare spending over time.
              </p>

              {/* Legend */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-6 text-sm mb-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-[#E5B700] rounded-full mr-2"></span>
                  <span className="text-gray-700">Total User 22,653</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  <span className="text-gray-700">Active User 3,671</span>
                </span>
              </div>

              {/* Chart */}
              <div className="h-[250px] sm:h-[300px] w-full overflow-x-auto">
                <ImprovedLineChart data={chartData} />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Ticket Resolved Rate */}
              <div className="bg-[#FFFAEF] rounded-xl p-4 sm:p-6 border-2 border-[#E5B700]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Ticket Resolved Rate
                  </h3>
                  <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
                    <button className="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#1F2937] text-white flex-1 sm:flex-initial">
                      This month
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-transparent text-gray-600 hover:text-gray-800 flex-1 sm:flex-initial">
                      Last month
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Manage your team members and their account permissions here.
                </p>

                <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
                  {/* Progress Circle */}
                  <div className="relative flex-shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="50"
                        stroke="#E5E5E5"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="50"
                        stroke="#E5B700"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 50 * 0.8} ${
                          2 * Math.PI * 50
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-500 mb-1">
                        Resolved %
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        80%
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0 mb-1 sm:mb-0"></span>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Total Ticket
                          </p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-800">
                            180
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0 mb-1 sm:mb-0"></span>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Resolved Tickets
                          </p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-800">
                            144
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0 mb-1 sm:mb-0"></span>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Resolution Rate
                          </p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-800">
                            80%
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0 mb-1 sm:mb-0"></span>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Avg. Resolution Time
                          </p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-800">
                            14 hrs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2"></span>
                    <div>
                      <p className="text-sm text-gray-600">
                        Change from Last Month
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        +6%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Revenue Overview */}
              <div className="bg-[#FFFAEF] rounded-xl p-4 sm:p-6 border-2 border-[#E5B700]">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                    Token Revenue Overview
                  </h3>
                </div>

                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <DonutChart />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* First row of legend */}
                  <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Token Revenue</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#FFC107] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Redeems</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#FF9800] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Claimed Revenue</span>
                    </div>
                  </div>

                  {/* Second row of legend */}
                  <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#E5B700] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Token Worth</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#FFC107] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Token Balance</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#FF9800] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">Token Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Activity */}
            <div className="bg-[#FFFAEF] rounded-xl shadow-sm p-4 sm:p-6 border-2 border-[#E5B700]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Recent Activity
                </h3>
                <a href="#" className="text-sm text-[#E5B700] font-medium">
                  View All
                </a>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {notifications.slice(0, 5).map((notification, index) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${notification.avatar}?w=40&h=40&fit=crop&crop=faces&auto=format`}
                      alt={notification.user}
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${notification.user}&background=E5B700&color=fff&size=32`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {notification.user}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-200 bg-white">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                Notifications
              </h3>
              <div className="space-y-4">
                <NotificationItem
                  icon={
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        background: "rgba(229, 183, 0, 0.20)",
                        display: "flex",
                        padding: "0.25rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13 8.99997H14C14.1326 8.99997 14.2598 8.94729 14.3536 8.85353C14.4473 8.75976 14.5 8.63258 14.5 8.49997C14.5 8.36736 14.4473 8.24019 14.3536 8.14642C14.2598 8.05265 14.1326 7.99997 14 7.99997H13V6.99997H14C14.1326 6.99997 14.2598 6.94729 14.3536 6.85353C14.4473 6.75976 14.5 6.63258 14.5 6.49997C14.5 6.36736 14.4473 6.24019 14.3536 6.14642C14.2598 6.05265 14.1326 5.99997 14 5.99997H12.975C12.8646 4.90257 12.3933 3.87277 11.635 3.07185L12.8538 1.85372C12.9002 1.80727 12.9371 1.75212 12.9622 1.69142C12.9873 1.63072 13.0003 1.56567 13.0003 1.49997C13.0003 1.43428 12.9873 1.36922 12.9622 1.30852C12.9371 1.24783 12.9002 1.19268 12.8538 1.14622C12.8073 1.09977 12.7521 1.06292 12.6914 1.03778C12.6308 1.01263 12.5657 0.999695 12.5 0.999695C12.4343 0.999695 12.3692 1.01263 12.3086 1.03778C12.2479 1.06292 12.1927 1.09977 12.1462 1.14622L10.8781 2.41497C10.0365 1.81961 9.03093 1.4999 8 1.4999C6.96907 1.4999 5.96351 1.81961 5.12187 2.41497L3.85375 1.14622C3.75993 1.0524 3.63268 0.999695 3.5 0.999695C3.36732 0.999695 3.24007 1.0524 3.14625 1.14622C3.05243 1.24004 2.99972 1.36729 2.99972 1.49997C2.99972 1.63265 3.05243 1.7599 3.14625 1.85372L4.365 3.07185C3.6067 3.87277 3.13544 4.90257 3.025 5.99997H2C1.86739 5.99997 1.74021 6.05265 1.64645 6.14642C1.55268 6.24019 1.5 6.36736 1.5 6.49997C1.5 6.63258 1.55268 6.75976 1.64645 6.85353C1.74021 6.94729 1.86739 6.99997 2 6.99997H3V7.99997H2C1.86739 7.99997 1.74021 8.05265 1.64645 8.14642C1.55268 8.24019 1.5 8.36736 1.5 8.49997C1.5 8.63258 1.55268 8.75976 1.64645 8.85353C1.74021 8.94729 1.86739 8.99997 2 8.99997H3V9.49997C3 9.66872 3.00875 9.8356 3.025 9.99997H2C1.86739 9.99997 1.74021 10.0527 1.64645 10.1464C1.55268 10.2402 1.5 10.3674 1.5 10.5C1.5 10.6326 1.55268 10.7598 1.64645 10.8535C1.74021 10.9473 1.86739 11 2 11H3.23C3.54904 12.0152 4.18366 12.9021 5.04155 13.5318C5.89944 14.1614 6.93584 14.5009 8 14.5009C9.06416 14.5009 10.1006 14.1614 10.9584 13.5318C11.8163 12.9021 12.451 12.0152 12.77 11H14C14.1326 11 14.2598 10.9473 14.3536 10.8535C14.4473 10.7598 14.5 10.6326 14.5 10.5C14.5 10.3674 14.4473 10.2402 14.3536 10.1464C14.2598 10.0527 14.1326 9.99997 14 9.99997H12.975C12.9913 9.8356 13 9.66872 13 9.49997V8.99997ZM8 2.49997C8.97381 2.50118 9.91381 2.85722 10.6441 3.50144C11.3744 4.14566 11.8448 5.03391 11.9675 5.99997H4.03C4.15271 5.03349 4.62356 4.14489 5.35435 3.50061C6.08515 2.85633 7.02576 2.50058 8 2.49997ZM8.5 13.4675V8.49997C8.5 8.36736 8.44732 8.24019 8.35355 8.14642C8.25979 8.05265 8.13261 7.99997 8 7.99997C7.86739 7.99997 7.74021 8.05265 7.64645 8.14642C7.55268 8.24019 7.5 8.36736 7.5 8.49997V13.4675C6.53394 13.3448 5.64568 12.8743 5.00146 12.1441C4.35724 11.4138 4.00121 10.4738 4 9.49997V6.99997H12V9.49997C11.9988 10.4738 11.6428 11.4138 10.9985 12.1441C10.3543 12.8743 9.46606 13.3448 8.5 13.4675Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  }
                  text="You fixed a bug."
                  time="Just now"
                />
                <NotificationItem
                  icon={
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        background: "rgba(1, 31, 63, 0.10)",
                        display: "flex",
                        padding: "0.25rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M14.4324 13.25C13.4806 11.6044 12.0137 10.4244 10.3018 9.86499C11.1486 9.3609 11.8065 8.59279 12.1744 7.67861C12.5424 6.76444 12.6001 5.75474 12.3387 4.80459C12.0773 3.85444 11.5112 3.01636 10.7274 2.41907C9.94359 1.82178 8.98538 1.49829 7.99993 1.49829C6.96907 1.49829 5.96351 1.81961 5.12187 2.41497L3.85375 1.14622C3.75993 1.0524 3.63268 0.999695 3.5 0.999695C3.36732 0.999695 3.24007 1.0524 3.14625 1.14622C3.05243 1.24004 2.99972 1.36729 2.99972 1.49997C2.99972 1.63265 3.05243 1.7599 3.14625 1.85372L4.365 3.07185C3.6067 3.87277 3.13544 4.90257 3.025 5.99997H2C1.86739 5.99997 1.74021 6.05265 1.64645 6.14642C1.55268 6.24019 1.5 6.36736 1.5 6.49997C1.5 6.63258 1.55268 6.75976 1.64645 6.85353C1.74021 6.94729 1.86739 6.99997 2 6.99997H3V7.99997H2C1.86739 7.99997 1.74021 8.05265 1.64645 8.14642C1.55268 8.24019 1.5 8.36736 1.5 8.49997C1.5 8.63258 1.55268 8.75976 1.64645 8.85353C1.74021 8.94729 1.86739 8.99997 2 8.99997H3V9.49997C3 9.66872 3.00875 9.8356 3.025 9.99997H2C1.86739 9.99997 1.74021 10.0527 1.64645 10.1464C1.55268 10.2402 1.5 10.3674 1.5 10.5C1.5 10.6326 1.55268 10.7598 1.64645 10.8535C1.74021 10.9473 1.86739 11 2 11H3.23C3.54904 12.0152 4.18366 12.9021 5.04155 13.5318C5.89944 14.1614 6.93584 14.5009 8 14.5009C9.06416 14.5009 10.1006 14.1614 10.9584 13.5318C11.8163 12.9021 12.451 12.0152 12.77 11H14C14.1326 11 14.2598 10.9473 14.3536 10.8535C14.4473 10.7598 14.5 10.6326 14.5 10.5C14.5 10.3674 14.4473 10.2402 14.3536 10.1464C14.2598 10.0527 14.1326 9.99997 14 9.99997H12.975C12.9913 9.8356 13 9.66872 13 9.49997V8.99997ZM8 2.49997C8.97381 2.50118 9.91381 2.85722 10.6441 3.50144C11.3744 4.14566 11.8448 5.03391 11.9675 5.99997H4.03C4.15271 5.03349 4.62356 4.14489 5.35435 3.50061C6.08515 2.85633 7.02576 2.50058 8 2.49997ZM8.5 13.4675V8.49997C8.5 8.36736 8.44732 8.24019 8.35355 8.14642C8.25979 8.05265 8.13261 7.99997 8 7.99997C7.86739 7.99997 7.74021 8.05265 7.64645 8.14642C7.55268 8.24019 7.5 8.36736 7.5 8.49997V13.4675C6.53394 13.3448 5.64568 12.8743 5.00146 12.1441C4.35724 11.4138 4.00121 10.4738 4 9.49997V6.99997H12V9.49997C11.9988 10.4738 11.6428 11.4138 10.9985 12.1441C10.3543 12.8743 9.46606 13.3448 8.5 13.4675Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  }
                  text="You fixed a bug."
                  time="12 hours ago"
                />
                <NotificationItem
                  icon={
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        background: "rgba(229, 183, 0, 0.20)",
                        display: "flex",
                        padding: "0.25rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M7.99991 5.50001C7.50546 5.50001 7.02211 5.64663 6.61099 5.92133C6.19986 6.19604 5.87943 6.58648 5.69021 7.0433C5.50099 7.50011 5.45148 8.00278 5.54795 8.48773C5.64441 8.97269 5.88251 9.41814 6.23214 9.76777C6.58178 10.1174 7.02723 10.3555 7.51219 10.452C7.99714 10.5484 8.4998 10.4989 8.95662 10.3097C9.41344 10.1205 9.80388 9.80006 10.0786 9.38893C10.3533 8.97781 10.4999 8.49446 10.4999 8.00001C10.4999 7.33697 10.2365 6.70108 9.76768 6.23224C9.29884 5.7634 8.66295 5.50001 7.99991 5.50001ZM7.99991 9.50001C7.70324 9.50001 7.41323 9.41203 7.16656 9.24721C6.91988 9.08239 6.72762 8.84812 6.61409 8.57403C6.50056 8.29994 6.47086 7.99834 6.52873 7.70737C6.58661 7.4164 6.72947 7.14913 6.93925 6.93935C7.14903 6.72957 7.4163 6.58671 7.70728 6.52883C7.99825 6.47095 8.29985 6.50066 8.57394 6.61419C8.84803 6.72772 9.08229 6.91998 9.24712 7.16665C9.41194 7.41333 9.49991 7.70334 9.49991 8.00001C9.49991 8.39783 9.34188 8.77936 9.06057 9.06067C8.77927 9.34197 8.39774 9.50001 7.99991 9.50001ZM12.6068 9.94626C12.392 10.4541 12.0946 10.9229 11.7268 11.3338C11.6377 11.4301 11.5143 11.4876 11.3832 11.4938C11.2522 11.5 11.1239 11.4545 11.0261 11.3669C10.9283 11.2794 10.8689 11.157 10.8606 11.026C10.8523 10.895 10.8958 10.766 10.9818 10.6669C11.6383 9.93385 12.0013 8.98438 12.0013 8.00032C12.0013 7.01626 11.6383 6.06679 10.9818 5.33376C10.9368 5.28504 10.9019 5.22786 10.8792 5.16554C10.8565 5.10322 10.8464 5.037 10.8495 4.97074C10.8527 4.90449 10.869 4.83952 10.8975 4.77962C10.926 4.71972 10.9661 4.66609 11.0155 4.62185C11.0649 4.57761 11.1227 4.54365 11.1853 4.52194C11.248 4.50023 11.3144 4.49121 11.3806 4.4954C11.4468 4.49959 11.5115 4.51691 11.5709 4.54635C11.6304 4.57579 11.6833 4.61676 11.7268 4.66688C12.3581 5.37334 12.776 6.2445 12.9318 7.17906C13.0875 8.11362 12.9748 9.07321 12.6068 9.94626ZM4.31241 6.44313C4.0174 7.14149 3.92692 7.9093 4.05152 8.6571C4.17611 9.40491 4.51066 10.1019 5.01616 10.6669C5.10212 10.766 5.14565 10.895 5.13736 11.026C5.12907 11.157 5.06962 11.2794 4.97184 11.3669C4.87406 11.4545 4.74579 11.5 4.6147 11.4938C4.48362 11.4876 4.36023 11.4301 4.27116 11.3338C3.45028 10.4175 2.99635 9.23053 2.99635 8.00032C2.99635 6.77011 3.45028 5.58316 4.27116 4.66688C4.35959 4.56784 4.48375 4.50799 4.61631 4.50048C4.74888 4.49298 4.87899 4.53845 4.97804 4.62688C5.07708 4.71532 5.13693 4.83947 5.14443 4.97204C5.15194 5.1046 5.10647 5.23472 5.01804 5.33376C4.72304 5.66194 4.48458 6.03683 4.31241 6.44313ZM15.4999 8.00001C15.5029 9.96359 14.7331 11.8495 13.3568 13.25C13.3113 13.2987 13.2564 13.3378 13.1956 13.365C13.1347 13.3922 13.069 13.4069 13.0024 13.4083C12.9358 13.4098 12.8695 13.3979 12.8075 13.3733C12.7456 13.3488 12.6891 13.3121 12.6415 13.2654C12.5939 13.2188 12.5562 13.163 12.5304 13.1016C12.5047 13.0401 12.4915 12.9741 12.4916 12.9074C12.4918 12.8407 12.5052 12.7748 12.5312 12.7134C12.5572 12.652 12.5952 12.5965 12.643 12.55C13.8347 11.3359 14.5024 9.70253 14.5024 8.00126C14.5024 6.29999 13.8347 4.66666 12.643 3.45251C12.5499 3.35786 12.4981 3.23008 12.4992 3.09728C12.5002 2.96448 12.554 2.83754 12.6487 2.74438C12.7433 2.65123 12.8711 2.59948 13.0039 2.60054C13.1367 2.60159 13.2636 2.65536 13.3568 2.75001C14.7331 4.15053 15.5029 6.03642 15.4999 8.00001ZM3.35679 12.5488C3.40283 12.5956 3.43919 12.6511 3.4638 12.712C3.4884 12.7729 3.50077 12.8381 3.50019 12.9038C3.49961 12.9695 3.48609 13.0344 3.46042 13.0949C3.43474 13.1554 3.3974 13.2102 3.35054 13.2563C3.30367 13.3023 3.2482 13.3387 3.18728 13.3633C3.12636 13.3879 3.06119 13.4002 2.99549 13.3997C2.92979 13.3991 2.86485 13.3856 2.80438 13.3599C2.74391 13.3342 2.68908 13.2969 2.64304 13.25C1.2669 11.8491 0.49585 9.96378 0.49585 8.00001C0.49585 6.03623 1.2669 4.15096 2.64304 2.75001C2.68857 2.70133 2.74338 2.66224 2.80424 2.63505C2.8651 2.60786 2.93078 2.59311 2.99742 2.59167C3.06406 2.59023 3.13032 2.60213 3.19229 2.62668C3.25427 2.65122 3.31071 2.6879 3.3583 2.73458C3.40589 2.78125 3.44367 2.83697 3.46941 2.89846C3.49515 2.95994 3.50834 3.02595 3.5082 3.09261C3.50806 3.15927 3.49459 3.22523 3.46859 3.2866C3.44259 3.34798 3.40457 3.40354 3.35679 3.45001C2.16508 4.66416 1.49744 6.29748 1.49744 7.99876C1.49744 9.70003 2.16508 11.3334 3.35679 12.5475V12.5488Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  }
                  text="Andi Lane subscribed to you."
                  time="Today, 11:59 AM"
                />
                <NotificationItem
                  icon={
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        background: "rgba(229, 183, 0, 0.20)",
                        display: "flex",
                        padding: "0.25rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M7.99991 5.50001C7.50546 5.50001 7.02211 5.64663 6.61099 5.92133C6.19986 6.19604 5.87943 6.58648 5.69021 7.0433C5.50099 7.50011 5.45148 8.00278 5.54795 8.48773C5.64441 8.97269 5.88251 9.41814 6.23214 9.76777C6.58178 10.1174 7.02723 10.3555 7.51219 10.452C7.99714 10.5484 8.4998 10.4989 8.95662 10.3097C9.41344 10.1205 9.80388 9.80006 10.0786 9.38893C10.3533 8.97781 10.4999 8.49446 10.4999 8.00001C10.4999 7.33697 10.2365 6.70108 9.76768 6.23224C9.29884 5.7634 8.66295 5.50001 7.99991 5.50001ZM7.99991 9.50001C7.70324 9.50001 7.41323 9.41203 7.16656 9.24721C6.91988 9.08239 6.72762 8.84812 6.61409 8.57403C6.50056 8.29994 6.47086 7.99834 6.52873 7.70737C6.58661 7.4164 6.72947 7.14913 6.93925 6.93935C7.14903 6.72957 7.4163 6.58671 7.70728 6.52883C7.99825 6.47095 8.29985 6.50066 8.57394 6.61419C8.84803 6.72772 9.08229 6.91998 9.24712 7.16665C9.41194 7.41333 9.49991 7.70334 9.49991 8.00001C9.49991 8.39783 9.34188 8.77936 9.06057 9.06067C8.77927 9.34197 8.39774 9.50001 7.99991 9.50001ZM12.6068 9.94626C12.392 10.4541 12.0946 10.9229 11.7268 11.3338C11.6377 11.4301 11.5143 11.4876 11.3832 11.4938C11.2522 11.5 11.1239 11.4545 11.0261 11.3669C10.9283 11.2794 10.8689 11.157 10.8606 11.026C10.8523 10.895 10.8958 10.766 10.9818 10.6669C11.6383 9.93385 12.0013 8.98438 12.0013 8.00032C12.0013 7.01626 11.6383 6.06679 10.9818 5.33376C10.9368 5.28504 10.9019 5.22786 10.8792 5.16554C10.8565 5.10322 10.8464 5.037 10.8495 4.97074C10.8527 4.90449 10.869 4.83952 10.8975 4.77962C10.926 4.71972 10.9661 4.66609 11.0155 4.62185C11.0649 4.57761 11.1227 4.54365 11.1853 4.52194C11.248 4.50023 11.3144 4.49121 11.3806 4.4954C11.4468 4.49959 11.5115 4.51691 11.5709 4.54635C11.6304 4.57579 11.6833 4.61676 11.7268 4.66688C12.3581 5.37334 12.776 6.2445 12.9318 7.17906C13.0875 8.11362 12.9748 9.07321 12.6068 9.94626ZM4.31241 6.44313C4.0174 7.14149 3.92692 7.9093 4.05152 8.6571C4.17611 9.40491 4.51066 10.1019 5.01616 10.6669C5.10212 10.766 5.14565 10.895 5.13736 11.026C5.12907 11.157 5.06962 11.2794 4.97184 11.3669C4.87406 11.4545 4.74579 11.5 4.6147 11.4938C4.48362 11.4876 4.36023 11.4301 4.27116 11.3338C3.45028 10.4175 2.99635 9.23053 2.99635 8.00032C2.99635 6.77011 3.45028 5.58316 4.27116 4.66688C4.35959 4.56784 4.48375 4.50799 4.61631 4.50048C4.74888 4.49298 4.87899 4.53845 4.97804 4.62688C5.07708 4.71532 5.13693 4.83947 5.14443 4.97204C5.15194 5.1046 5.10647 5.23472 5.01804 5.33376C4.72304 5.66194 4.48458 6.03683 4.31241 6.44313ZM15.4999 8.00001C15.5029 9.96359 14.7331 11.8495 13.3568 13.25C13.3113 13.2987 13.2564 13.3378 13.1956 13.365C13.1347 13.3922 13.069 13.4069 13.0024 13.4083C12.9358 13.4098 12.8695 13.3979 12.8075 13.3733C12.7456 13.3488 12.6891 13.3121 12.6415 13.2654C12.5939 13.2188 12.5562 13.163 12.5304 13.1016C12.5047 13.0401 12.4915 12.9741 12.4916 12.9074C12.4918 12.8407 12.5052 12.7748 12.5312 12.7134C12.5572 12.652 12.5952 12.5965 12.643 12.55C13.8347 11.3359 14.5024 9.70253 14.5024 8.00126C14.5024 6.29999 13.8347 4.66666 12.643 3.45251C12.5499 3.35786 12.4981 3.23008 12.4992 3.09728C12.5002 2.96448 12.554 2.83754 12.6487 2.74438C12.7433 2.65123 12.8711 2.59948 13.0039 2.60054C13.1367 2.60159 13.2636 2.65536 13.3568 2.75001C14.7331 4.15053 15.5029 6.03642 15.4999 8.00001ZM3.35679 12.5488C3.40283 12.5956 3.43919 12.6511 3.4638 12.712C3.4884 12.7729 3.50077 12.8381 3.50019 12.9038C3.49961 12.9695 3.48609 13.0344 3.46042 13.0949C3.43474 13.1554 3.3974 13.2102 3.35054 13.2563C3.30367 13.3023 3.2482 13.3387 3.18728 13.3633C3.12636 13.3879 3.06119 13.4002 2.99549 13.3997C2.92979 13.3991 2.86485 13.3856 2.80438 13.3599C2.74391 13.3342 2.68908 13.2969 2.64304 13.25C1.2669 11.8491 0.49585 9.96378 0.49585 8.00001C0.49585 6.03623 1.2669 4.15096 2.64304 2.75001C2.68857 2.70133 2.74338 2.66224 2.80424 2.63505C2.8651 2.60786 2.93078 2.59311 2.99742 2.59167C3.06406 2.59023 3.13032 2.60213 3.19229 2.62668C3.25427 2.65122 3.31071 2.6879 3.3583 2.73458C3.40589 2.78125 3.44367 2.83697 3.46941 2.89846C3.49515 2.95994 3.50834 3.02595 3.5082 3.09261C3.50806 3.15927 3.49459 3.22523 3.46859 3.2866C3.44259 3.34798 3.40457 3.40354 3.35679 3.45001C2.16508 4.66416 1.49744 6.29748 1.49744 7.99876C1.49744 9.70003 2.16508 11.3334 3.35679 12.5475V12.5488Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  }
                  text="Andi Lane subscribed to you."
                  time="Today, 11:59 AM"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component - Made responsive
const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-3 sm:p-4 text-white relative overflow-hidden w-full h-20 sm:h-24 lg:h-28`}
    >
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
      <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
        <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">{icon}</div>
        <div>
          <p className="text-xs opacity-80">{title}</p>
          <p
            style={{
              color: "var(--gradient1, #FBCB07)",
              fontFamily: "Poppins",
              fontSize: "1.125rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "1.5rem",
              letterSpacing: "0.015rem",
            }}
            className="sm:text-xl sm:leading-8"
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple Line Chart Component - restored to original style
const ImprovedLineChart = ({ data }) => {
  const maxValue = 25000;
  const height = 300;
  const width = 700;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 50;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const xScale = (index) =>
    paddingLeft + (index * chartWidth) / (data.length - 1);
  const yScale = (value) =>
    paddingTop + chartHeight - (value / maxValue) * chartHeight;

  // Create smooth curved paths
  const createSmoothPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];

      // Smooth curve control points
      const cp1x = prevPoint.x + (currPoint.x - prevPoint.x) * 0.4;
      const cp1y = prevPoint.y;
      const cp2x = currPoint.x - (currPoint.x - prevPoint.x) * 0.4;
      const cp2y = currPoint.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currPoint.x} ${currPoint.y}`;
    }

    return path;
  };

  const totalPoints = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.total),
  }));
  const activePoints = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.active),
  }));

  const totalPath = createSmoothPath(totalPoints);
  const activePath = createSmoothPath(activePoints);

  // Create area fill path
  const areaPath =
    totalPath +
    ` L ${xScale(data.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

  return (
    <div className="w-full h-full min-w-[600px] sm:min-w-0">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5B700" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E5B700" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 5000, 10000, 15000, 20000, 25000].map((value, index) => (
          <g key={index}>
            <line
              x1={paddingLeft}
              y1={yScale(value)}
              x2={width - paddingRight}
              y2={yScale(value)}
              stroke="#F0F0F0"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 10}
              y={yScale(value) + 4}
              textAnchor="end"
              fontSize="10"
              fill="#9CA3AF"
              className="sm:text-xs"
            >
              {value >= 1000 ? `${value / 1000}k` : value}
            </text>
          </g>
        ))}

        {/* Vertical grid lines */}
        {data.map((d, i) => (
          <g key={i}>
            <line
              x1={xScale(i)}
              y1={paddingTop}
              x2={xScale(i)}
              y2={height - paddingBottom}
              stroke="#F8F8F8"
              strokeWidth="1"
            />
            <text
              x={xScale(i)}
              y={height - paddingBottom + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#9CA3AF"
              className="sm:text-xs"
            >
              {d.month}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Total user line (yellow) */}
        <path
          d={totalPath}
          fill="none"
          stroke="#E5B700"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active user line (dark gray) */}
        <path
          d={activePath}
          fill="none"
          stroke="#4B5563"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Donut Chart Component - Updated to match reference image
const DonutChart = () => {
  const centerX = 100;
  const centerY = 100;
  const radius = 60;
  const strokeWidth = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56"
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#F5F5F5"
          strokeWidth={strokeWidth}
        />

        {/* $8,500 segment (largest - top right, bright yellow) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#FFD700"
          strokeWidth={strokeWidth}
          strokeDasharray={`${0.38 * circumference} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />

        {/* $6,400 segment (right side, medium yellow) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#E5B700"
          strokeWidth={strokeWidth}
          strokeDasharray={`${0.28 * circumference} ${circumference}`}
          strokeDashoffset={`-${0.38 * circumference}`}
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />

        {/* $5,100 segment (bottom right, orange yellow) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#F4A920"
          strokeWidth={strokeWidth}
          strokeDasharray={`${0.22 * circumference} ${circumference}`}
          strokeDashoffset={`-${0.66 * circumference}`}
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />

        {/* $3,750 segment (left side, darker yellow) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#DAA520"
          strokeWidth={strokeWidth}
          strokeDasharray={`${0.12 * circumference} ${circumference}`}
          strokeDashoffset={`-${0.88 * circumference}`}
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />

        {/* Value labels positioned like reference image */}
        <text
          x="100"
          y="45"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $0k
        </text>
        <text
          x="145"
          y="70"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $1,900
        </text>
        <text
          x="160"
          y="110"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $8,500
        </text>
        <text
          x="140"
          y="150"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $3,750
        </text>
        <text
          x="70"
          y="160"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $6,400
        </text>
        <text
          x="45"
          y="110"
          textAnchor="middle"
          style={{
            color: "var(--Sub-text-color, #363636)",
            fontFamily: "Inter",
            fontSize: "0.6875rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            fill: "var(--Sub-text-color, #363636)",
          }}
        >
          $5,100
        </text>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-gray-800">$9k</div>
          <div className="text-xs sm:text-sm text-gray-500">$1,900</div>
        </div>
      </div>
    </div>
  );
};

// Notification Item Component - Updated to match reference
const NotificationItem = ({ icon, text, time }) => {
  return (
    <div className="flex items-center space-x-3 w-full py-2">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 font-medium">{text}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default Dashboard;
