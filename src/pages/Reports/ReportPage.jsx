import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  FileText,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Coins,
  X,
} from "lucide-react";
import Header from "../../components/Header";

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Revenue transactions data
  const revenueTransactions = [
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "John D.",
      type: "Token Redeem",
      grossAmount: "$120.00",
      feesDeducted: "$5.00",
      netAmount: "$115.00",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      type: "Ad Revenue",
      grossAmount: "$50.00",
      feesDeducted: "$3.00",
      netAmount: "$47.00",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      type: "Ad Revenue",
      grossAmount: "$80.00",
      feesDeducted: "-",
      netAmount: "$35.00",
      status: "Failed",
    },
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      type: "Ad Revenue",
      grossAmount: "$80.00",
      feesDeducted: "$2.00",
      netAmount: "$78.00",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      type: "Ad Revenue",
      grossAmount: "$100.00",
      feesDeducted: "$5.00",
      netAmount: "$95.00",
      status: "Pending",
    },
    {
      date: "Jul 28, 2025",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      type: "Ad Revenue",
      grossAmount: "$130.00",
      feesDeducted: "$5.00",
      netAmount: "$125.00",
      status: "Completed",
    },
  ];

  // Token transactions data
  const tokenTransactions = [
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "John D.",
      action: "Earned",
      source: "Weekly Login",
      tokens: "+20",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "Avery Scott",
      action: "Redeemed",
      source: "Ad View",
      tokens: "+50",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "Cameron Reese",
      action: "Bonus",
      source: "Discount Coupon",
      tokens: "-100",
      status: "Failed",
    },
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "Dakota James",
      action: "Redeemed",
      source: "Premium Feature",
      tokens: "-200",
      status: "Completed",
    },
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "Thomas M.",
      action: "Expired",
      source: "Inactivity",
      tokens: "-30",
      status: "Expired",
    },
    {
      date: "Jul 28, 2025",
      time: "10:20 AM",
      transactionId: "TXN#R457321",
      userName: "Skyler Quinn",
      action: "Earned",
      source: "Daily Task complete",
      tokens: "+200",
      status: "Completed",
    },
  ];

  // User report data
  const userReports = [
    {
      userName: "Alex Morgan",
      userId: "TXN#R457321",
      subscriptionStatus: "Active",
      renewalDate: "Jul 24, 2025  10:54 AM",
      tokenEarned: "+500",
      tokenRedeemed: "-100",
    },
    {
      userName: "Jordan Taylor",
      userId: "TXN#R457321",
      subscriptionStatus: "Active",
      renewalDate: "Jul 30, 2025  11:00 AM",
      tokenEarned: "+300",
      tokenRedeemed: "-150",
    },
    {
      userName: "Taylor Brooks",
      userId: "TXN#R457321",
      subscriptionStatus: "Expired",
      renewalDate: "Jul 15, 2025  10:54 AM",
      tokenEarned: "+700",
      tokenRedeemed: "-400",
    },
    {
      userName: "Casey Morgan",
      userId: "TXN#R457321",
      subscriptionStatus: "Active",
      renewalDate: "Aug 15, 2025  10:54 AM",
      tokenEarned: "+600",
      tokenRedeemed: "-100",
    },
    {
      userName: "Riley Cameron",
      userId: "TXN#R457321",
      subscriptionStatus: "Expired",
      renewalDate: "Aug 02, 2025  10:54 AM",
      tokenEarned: "+300",
      tokenRedeemed: "-100",
    },
    {
      userName: "Morgan Lee",
      userId: "TXN#R457321",
      subscriptionStatus: "Active",
      renewalDate: "Aug 05, 2025  10:54 AM",
      tokenEarned: "+600",
      tokenRedeemed: "-100",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
      case "Active":
        return "bg-green-100 text-green-700";
      case "Failed":
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTokenStyle = (tokens) => {
    return tokens.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="Report Page" icon={FileText} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <X
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5B700] bg-gray-50 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-200 min-w-[80px] sm:min-w-[100px] text-sm sm:text-base whitespace-nowrap ${
                activeTab === "revenue"
                  ? "bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("token")}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-200 min-w-[80px] sm:min-w-[100px] text-sm sm:text-base whitespace-nowrap ${
                activeTab === "token"
                  ? "bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Token
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-200 min-w-[80px] sm:min-w-[100px] text-sm sm:text-base whitespace-nowrap ${
                activeTab === "user"
                  ? "bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              User
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {activeTab === "revenue" && (
            <>
              <StatCard
                title="Total Revenue"
                value="02"
                icon={<DollarSign className="w-6 h-6" />}
              />
              <StatCard
                title="Gross Revenue"
                value="1,200"
                icon={<TrendingUp className="w-6 h-6" />}
              />
              <StatCard
                title="Net Revenue"
                value="3,653"
                icon={<DollarSign className="w-6 h-6" />}
              />
            </>
          )}
          {activeTab === "token" && (
            <>
              <StatCard
                title="Total Token"
                value="6,000"
                icon={<Coins className="w-6 h-6" />}
              />
              <StatCard
                title="Tokens Earned"
                value="3,200"
                icon={<TrendingUp className="w-6 h-6" />}
              />
              <StatCard
                title="Tokens Redeemed"
                value="2,653"
                icon={<Coins className="w-6 h-6" />}
              />
            </>
          )}
          {activeTab === "user" && (
            <>
              <StatCard
                title="Active User"
                value="7,480"
                icon={<Users className="w-6 h-6" />}
              />
              <StatCard
                title="Passive User"
                value="1,200"
                icon={<Users className="w-6 h-6" />}
              />
              <StatCard
                title="Pending Payment"
                value="$4,653"
                icon={<DollarSign className="w-6 h-6" />}
              />
            </>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === "revenue" && (
          <RevenueTable transactions={revenueTransactions} />
        )}
        {activeTab === "token" && (
          <TokenTable transactions={tokenTransactions} />
        )}
        {activeTab === "user" && <UserTable users={userReports} />}
      </div>
    </div>
  );
};

// Revenue Table Component
const RevenueTable = ({ transactions }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Transaction Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {transactions.map((transaction, index) => (
          <div key={index} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.userName}
                </p>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  transaction.status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {transaction.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Type: </span>
                <span className="text-gray-900">{transaction.type}</span>
              </div>
              <div>
                <span className="text-gray-500">ID: </span>
                <span className="text-gray-900 text-xs">
                  {transaction.transactionId}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Gross: </span>
                <span className="text-gray-900">{transaction.grossAmount}</span>
              </div>
              <div>
                <span className="text-gray-500">Net: </span>
                <span className="text-gray-900">{transaction.netAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees Deducted
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.grossAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.feesDeducted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.netAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      transaction.status
                    )}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Token Table Component
const TokenTable = ({ transactions }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Expired":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTokenStyle = (tokens) => {
    return tokens.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Token Transaction</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {transactions.map((transaction, index) => (
          <div key={index} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.userName}
                </p>
                <p className="text-sm text-gray-600">
                  {transaction.date} {transaction.time}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-medium ${getTokenStyle(
                    transaction.tokens
                  )}`}
                >
                  {transaction.tokens}
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      transaction.status
                    )}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Action: </span>
                <span className="text-gray-900">{transaction.action}</span>
              </div>
              <div>
                <span className="text-gray-500">Source: </span>
                <span className="text-gray-900">{transaction.source}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">ID: </span>
                <span className="text-gray-900 text-xs">
                  {transaction.transactionId}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.date}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${getTokenStyle(
                      transaction.tokens
                    )}`}
                  >
                    {transaction.tokens}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      transaction.status
                    )}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// User Table Component
const UserTable = ({ users }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTokenStyle = (tokens) => {
    return tokens.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">User Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E5B700] to-[#DE8806] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {users.map((user, index) => (
          <div key={index} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">{user.userName}</p>
                <p className="text-xs text-gray-600">{user.userId}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  user.subscriptionStatus
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {user.subscriptionStatus}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Renewal: </span>
                <span className="text-gray-900 text-xs">
                  {user.renewalDate}
                </span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-gray-500">Earned: </span>
                  <span
                    className={`font-medium ${getTokenStyle(user.tokenEarned)}`}
                  >
                    {user.tokenEarned}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Redeemed: </span>
                  <span
                    className={`font-medium ${getTokenStyle(
                      user.tokenRedeemed
                    )}`}
                  >
                    {user.tokenRedeemed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Renewal Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token Earned
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token Redeemed
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      user.subscriptionStatus
                    )}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {user.subscriptionStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.renewalDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${getTokenStyle(
                      user.tokenEarned
                    )}`}
                  >
                    {user.tokenEarned}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${getTokenStyle(
                      user.tokenRedeemed
                    )}`}
                  >
                    {user.tokenRedeemed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#011F3F] rounded-lg p-4 sm:p-6 text-white relative overflow-hidden">
      <svg
        width="140"
        height="140"
        viewBox="0 0 396 406"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-80"
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
      <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
        <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
          {React.cloneElement(icon, {
            className: "w-5 h-5 sm:w-6 sm:h-6 text-[#E5B700]",
          })}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm opacity-80 truncate">{title}</p>
          <p className="text-[#E5B700] text-xl sm:text-2xl font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
