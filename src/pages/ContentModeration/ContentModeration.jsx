import React, { useState } from "react";
import { AlertCircle, Trash2, Ban, Shield, TrendingUp, Eye, X, User, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { 
  useGetAdminReportsQuery, 
  useGetAdminBlockedUsersQuery, 
  useGetAdminStatsQuery, 
  useDeletePostMutation, 
  useBlockUserMutation, 
  useUnblockUserMutation 
} from "../../features/api/apiSlice";

// Helper component for pagination controls
const PaginationControls = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="poppins-medium text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Helper component for Stat Card
const StatCard = ({ title, value, icon, loading, valueColor = "text-gray-800" }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm poppins-regular">{title}</p>
        <div className="h-8 flex items-center">
          {loading ? (
             <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
             <p className={`text-2xl poppins-bold ${valueColor}`}>{value || 0}</p>
          )}
        </div>
      </div>
      {icon}
    </div>
  </div>
);

const ContentModeration = () => {
  // UI State
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Pagination State
  const [reportsPage, setReportsPage] = useState(1);
  const [blockedPage, setBlockedPage] = useState(1);

  // RTK Query Hooks
  const { data: statsData, isLoading: loadingStats } = useGetAdminStatsQuery();
  const stats = statsData?.stats || {};

  // Fetch reports only if active tab is reports (optional optimization, but RTK Query caches anyway so it's cheap)
  // We'll fetch always to keep cache warm or just let it mount. 
  // Let's rely on standard current page fetching.
  const { 
    data: reportsData, 
    isLoading: reportsLoading, 
    isFetching: reportsFetching 
  } = useGetAdminReportsQuery({ page: reportsPage, limit: 10 });
  
  const reports = reportsData?.reports || [];
  const reportsPagination = reportsData?.pagination || { totalPages: 1 };

  const { 
    data: blockedData, 
    isLoading: blockedLoading,
    isFetching: blockedFetching
  } = useGetAdminBlockedUsersQuery({ page: blockedPage, limit: 10 });
  
  const blockedUsers = blockedData?.blockedUsers || [];
  const blockedPagination = blockedData?.pagination || { totalPages: 1 };

  // Mutations
  const [deletePost] = useDeletePostMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  const handleDeletePost = async (postId, postAuthorUserId) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      const result = await deletePost({ postId, postAuthorUserId }).unwrap();
      alert(`Post deleted successfully. ${result.reportsResolved || 0} related reports were resolved.`);
      setSelectedReport(null); 
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.data?.error || "Failed to delete post");
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm("Are you sure you want to block this user?")) return;

    try {
      await blockUser(userId).unwrap();
      alert("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!confirm("Are you sure you want to unblock this user?")) return;

    try {
      await unblockUser(userId).unwrap();
      alert("User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl poppins-bold text-gray-800 mb-6">Content Moderation</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Reports" 
            value={(stats.pendingReports || 0) + (stats.resolvedReports || 0)} 
            icon={<TrendingUp className="w-8 h-8 text-blue-500" />} 
            loading={loadingStats} 
          />
          <StatCard 
            title="Pending Reports" 
            value={stats.pendingReports} 
            valueColor="text-orange-600"
            icon={<AlertCircle className="w-8 h-8 text-orange-500" />} 
            loading={loadingStats} 
          />
          <StatCard 
            title="Resolved Reports" 
            value={stats.resolvedReports} 
            valueColor="text-green-600"
            icon={<Shield className="w-8 h-8 text-green-500" />} 
            loading={loadingStats} 
          />
          <StatCard 
            title="Blocked Users" 
            value={stats.blockedUsers} 
            valueColor="text-red-600"
            icon={<Ban className="w-8 h-8 text-red-500" />} 
            loading={loadingStats} 
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-3 poppins-medium ${
                activeTab === "reports"
                  ? "border-b-2 border-[#E5B700] text-[#E5B700]"
                  : "text-gray-500"
              }`}
            >
              Reported Content
            </button>
            <button
              onClick={() => setActiveTab("blocked")}
              className={`px-6 py-3 poppins-medium ${
                activeTab === "blocked"
                  ? "border-b-2 border-[#E5B700] text-[#E5B700]"
                  : "text-gray-500"
              }`}
            >
              Blocked Users
            </button>
          </div>

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="p-6">
              {reportsLoading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="w-8 h-8 animate-spin text-[#E5B700]" />
                </div>
              ) : reports.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No reports found</p>
              ) : (
                <>
                   {reportsFetching && (
                        <div className="mb-2 w-full text-center">
                            <span className="text-xs text-gray-500 animate-pulse">Refreshing...</span>
                        </div>
                    )}
                  <div className={`space-y-4 ${reportsFetching ? 'opacity-70' : ''}`}>
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs poppins-medium ${
                                report.status === "pending"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {report.status}
                            </span>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(report.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 poppins-regular">Reported By</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                              <div>
                                  <p className="poppins-medium text-sm">
                                      {report.reporter?.firstName || report.reporter?.lastName 
                                        ? `${report.reporter?.firstName || ''} ${report.reporter?.lastName || ''}`.trim()
                                        : report.reporter?.email || 'Unknown User'}
                                  </p>
                                  {(report.reporter?.firstName || report.reporter?.lastName) && (
                                    <p className="text-xs text-gray-500">{report.reporter?.email}</p>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 poppins-regular">Post Published By</p>
                             <div className="flex items-center gap-2 mt-1">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                              <div>
                                  <p className="poppins-medium text-sm">
                                      {report.postAuthor?.firstName || report.postAuthor?.lastName 
                                        ? `${report.postAuthor?.firstName || ''} ${report.postAuthor?.lastName || ''}`.trim()
                                        : report.postAuthor?.email || 'Unknown User'}
                                  </p>
                                  {(report.postAuthor?.firstName || report.postAuthor?.lastName) && (
                                    <p className="text-xs text-gray-500">{report.postAuthor?.email}</p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 poppins-regular mb-1">Reason for Report</p>
                          <p className="text-gray-800 poppins-regular bg-red-50 p-2 rounded border border-red-100">{report.reason}</p>
                        </div>

                        {/* Reported Post Preview */}
                        <div className="mb-4 border rounded-lg overflow-hidden bg-gray-50">
                          <div className="bg-gray-100 px-3 py-2 border-b">
                            <p className="text-sm text-gray-600 poppins-medium">Reported Post</p>
                          </div>
                          {report.post ? (
                            <div className="p-3">
                              <p className="text-gray-800 poppins-regular text-sm leading-relaxed">
                                {report.post.content?.length > 150
                                  ? `${report.post.content.substring(0, 150)}...`
                                  : report.post.content}
                              </p>
                              {report.post.imageUrl && (
                                <div className="mt-2">
                                  <img
                                    src={report.post.imageUrl}
                                    alt="Post attachment"
                                    className="h-20 w-auto rounded border object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                <span>❤️ {report.post.likes || 0}</span>
                                <span>💬 {report.post.comments || 0}</span>
                                <span>📅 {new Date(report.post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-gray-400 italic text-sm">
                              Post content unavailable or deleted
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                           <button
                              onClick={() => setSelectedReport(report)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#E5B700] text-white rounded-lg hover:bg-yellow-600 poppins-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          {report.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleDeletePost(report.postId, report.postAuthorUserId)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 poppins-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Post
                              </button>
                              <button
                                onClick={() => handleBlockUser(report.postAuthor?.uid || report.postAuthorUserId)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 poppins-medium"
                              >
                                <Ban className="w-4 h-4" />
                                Block User
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Reports */}
                  <PaginationControls 
                    currentPage={reportsPage}
                    totalPages={reportsPagination.totalPages}
                    onPageChange={setReportsPage}
                    loading={reportsLoading || reportsFetching}
                  />
                </>
              )}
            </div>
          )}

          {/* Blocked Users Tab */}
          {activeTab === "blocked" && (
            <div className="p-6">
              {blockedLoading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="w-8 h-8 animate-spin text-[#E5B700]" />
                </div>
              ) : blockedUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No blocked users found</p>
              ) : (
                <>
                   {blockedFetching && (
                        <div className="mb-2 w-full text-center">
                            <span className="text-xs text-gray-500 animate-pulse">Refreshing...</span>
                        </div>
                    )}
                  <div className={`overflow-x-auto ${blockedFetching ? 'opacity-70' : ''}`}>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs poppins-medium text-gray-500 uppercase">
                            Blocker
                          </th>
                          <th className="px-6 py-3 text-left text-xs poppins-medium text-gray-500 uppercase">
                            Blocked User
                          </th>
                          <th className="px-6 py-3 text-left text-xs poppins-medium text-gray-500 uppercase">
                            Date
                          </th>
                           <th className="px-6 py-3 text-right text-xs poppins-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blockedUsers.map((block) => (
                          <tr key={block.id}>
                            <td className="px-6 py-4">
                              <p className="poppins-medium">
                                {block.blocker?.firstName} {block.blocker?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{block.blocker?.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="poppins-medium">
                                {block.blocked?.firstName} {block.blocked?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{block.blocked?.email}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(block.createdAt).toLocaleDateString()}
                            </td>
                             <td className="px-6 py-4 text-right">
                               <button
                                  onClick={() => handleUnblockUser(block.blockedUserId)}
                                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                              >
                                  Unblock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Blocked Users */}
                  <PaginationControls 
                    currentPage={blockedPage}
                    totalPages={blockedPagination.totalPages}
                    onPageChange={setBlockedPage}
                    loading={blockedLoading || blockedFetching}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Details Modal - Using same selectedReport state */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl poppins-bold text-gray-800">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
                 <div className={`p-4 rounded-lg flex justify-between items-center ${
                    selectedReport.status === "pending" ? "bg-orange-50 border border-orange-100" : "bg-green-50 border border-green-100"
                 }`}>
                     <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Status</p>
                        <p className={`font-bold ${selectedReport.status === 'pending' ? 'text-orange-600' : 'text-green-600'}`}>{selectedReport.status}</p>
                     </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 uppercase">Report Date</p>
                        <p className="text-gray-800">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                     </div>
                 </div>

                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" /> Reported By
                        </h3>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {selectedReport.reporter?.firstName?.[0] || selectedReport.reporter?.lastName?.[0] || selectedReport.reporter?.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="poppins-bold text-gray-800">
                                    {selectedReport.reporter?.firstName || selectedReport.reporter?.lastName 
                                      ? `${selectedReport.reporter?.firstName || ''} ${selectedReport.reporter?.lastName || ''}`.trim()
                                      : selectedReport.reporter?.email || 'Unknown User'}
                                </p>
                                {(selectedReport.reporter?.firstName || selectedReport.reporter?.lastName) && (
                                  <p className="text-sm text-gray-500">{selectedReport.reporter?.email}</p>
                                )}
                            </div>
                        </div>
                         <div className="mt-4 bg-gray-50 p-3 rounded">
                             <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Reason</p>
                             <p className="text-gray-700 italic">"{selectedReport.reason}"</p>
                         </div>
                     </div>
                      <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                             <User className="w-4 h-4" /> Post Author
                        </h3>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                {selectedReport.postAuthor?.firstName?.[0] || selectedReport.postAuthor?.lastName?.[0] || selectedReport.postAuthor?.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="poppins-bold text-gray-800">
                                    {selectedReport.postAuthor?.firstName || selectedReport.postAuthor?.lastName 
                                      ? `${selectedReport.postAuthor?.firstName || ''} ${selectedReport.postAuthor?.lastName || ''}`.trim()
                                      : selectedReport.postAuthor?.email || 'Unknown User'}
                                </p>
                                {(selectedReport.postAuthor?.firstName || selectedReport.postAuthor?.lastName) && (
                                  <p className="text-sm text-gray-500">{selectedReport.postAuthor?.email}</p>
                                )}
                            </div>
                        </div>
                     </div>
                </div>

                {/* Content */}
                <div className="border rounded-lg overflow-hidden">
                     <div className="bg-gray-50 p-3 border-b">
                         <h3 className="poppins-bold text-gray-700">Detailed Post Content</h3>
                     </div>
                     <div className="p-4">
                        {selectedReport.post ? (
                            <div className="space-y-4">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedReport.post.content}</p>
                                {selectedReport.post.imageUrl && (
                                    <div className="mt-4">
                                        <img src={selectedReport.post.imageUrl} alt="Post attachment" className="max-w-full h-auto rounded-lg border shadow-sm"/>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 bg-gray-50 rounded italic">
                                Post content unavailable or deleted.
                            </div>
                        )}
                     </div>
                </div>
            </div>
             <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                 <button onClick={() => setSelectedReport(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 poppins-medium">Close</button>
                 {selectedReport.status === "pending" && (
                    <>
                        <button onClick={() => handleDeletePost(selectedReport.postId, selectedReport.postAuthorUserId)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 poppins-medium">Delete Post</button>
                         <button onClick={() => handleBlockUser(selectedReport.postAuthor?.uid || selectedReport.postAuthorUserId)} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 poppins-medium">Block User</button>
                    </>
                 )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .poppins-regular { font-family: "Poppins", sans-serif; font-weight: 400; }
        .poppins-medium { font-family: "Poppins", sans-serif; font-weight: 500; }
        .poppins-bold { font-family: "Poppins", sans-serif; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default ContentModeration;
