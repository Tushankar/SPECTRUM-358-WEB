import React, { useState } from "react";
import { FileText, Calendar, Eye, X, ChevronLeft, ChevronRight, Heart, MessageCircle, AlertCircle } from "lucide-react";
import Header from "../../components/Header";
import { useGetAllPostsQuery } from "../../features/api/apiSlice";

const PostsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isLoading, isFetching, error } = useGetAllPostsQuery({ 
    page: currentPage, 
    limit: 10 
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getAuthorName = (author) => {
    if (!author) return "Unknown User";
    const name = `${author.firstName || ''} ${author.lastName || ''}`.trim();
    return name || author.email || "Unknown User";
  };

  const getAuthorInitial = (author) => {
    if (!author) return "?";
    return author.firstName?.[0] || author.lastName?.[0] || author.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Posts Management" icon={FileText} />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm poppins-regular">Total Posts</p>
                <div className="h-8 flex items-center">
                  {isLoading ? (
                     <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl poppins-bold text-blue-600">{pagination.totalPosts}</p>
                  )}
                </div>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm poppins-regular">Current Page</p>
                <div className="h-8 flex items-center">
                  {isLoading ? (
                     <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl poppins-bold text-green-600">{pagination.currentPage} / {pagination.totalPages}</p>
                  )}
                </div>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm poppins-regular">Posts Per Page</p>
                <p className="text-2xl poppins-bold text-purple-600">{pagination.postsPerPage}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
               <h2 className="text-xl poppins-semibold">All User Posts</h2>
               <p className="text-gray-500 text-sm poppins-regular mt-1">View all posts from all users</p>
            </div>
            {isFetching && !isLoading && (
                 <span className="text-xs text-gray-500 animate-pulse bg-gray-100 px-2 py-1 rounded">Refreshing...</span>
            )}
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5B700] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : error ? (
             <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading posts</h3>
              <p className="text-gray-500">{error.data?.message || "Failed to fetch posts. Please try again."}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500">There are no posts yet.</p>
            </div>
          ) : (
            <div className={`divide-y ${isFetching ? 'opacity-70' : ''}`}>
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Author Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5B700] to-[#F7931E] flex items-center justify-center text-white font-bold">
                        {post.author?.profilePicture ? (
                          <img 
                            src={post.author.profilePicture} 
                            alt={getAuthorName(post.author)}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span className={post.author?.profilePicture ? 'hidden' : ''}>
                          {getAuthorInitial(post.author)}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <p className="poppins-semibold text-gray-900">{getAuthorName(post.author)}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-500 poppins-regular flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.createdAt)}
                        </p>
                      </div>

                      {/* Post Title */}
                      {post.title && (
                        <h3 className="poppins-medium text-gray-800 mb-1">{post.title}</h3>
                      )}

                      {/* Post Content */}
                      <p className="text-gray-600 poppins-regular mb-3 line-clamp-2">
                        {post.content || "No content"}
                      </p>

                      {/* Post Image */}
                      {post.imageUrl && (
                        <div className="mb-3">
                          <img 
                            src={post.imageUrl} 
                            alt="Post image"
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Heart className="w-4 h-4 text-red-400" />
                          {post.likes || 0} likes
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          {post.comments || 0} comments
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#E5B700] text-white rounded-lg hover:bg-yellow-600 poppins-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-6 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500 poppins-regular">
                Showing {((pagination.currentPage - 1) * pagination.postsPerPage) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.postsPerPage, pagination.totalPosts)} of{" "}
                {pagination.totalPosts} posts
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || isLoading || isFetching}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg poppins-medium ${
                    pagination.hasPrevPage && !isLoading
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + idx;
                    } else {
                      pageNum = pagination.currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading || isFetching}
                        className={`w-10 h-10 rounded-lg poppins-medium ${
                          pagination.currentPage === pageNum
                            ? "bg-[#E5B700] text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        } disabled:opacity-50`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || isLoading || isFetching}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg poppins-medium ${
                    pagination.hasNextPage && !isLoading
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-[#E5B700] to-[#F7931E] text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl poppins-semibold">Post Details</h2>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Author Section */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E5B700] to-[#F7931E] flex items-center justify-center text-white text-xl font-bold">
                  {selectedPost.author?.profilePicture ? (
                    <img 
                      src={selectedPost.author.profilePicture} 
                      alt={getAuthorName(selectedPost.author)}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getAuthorInitial(selectedPost.author)
                  )}
                </div>
                <div>
                  <p className="poppins-bold text-gray-900 text-lg">{getAuthorName(selectedPost.author)}</p>
                  <p className="text-sm text-gray-500">{selectedPost.author?.email}</p>
                  <p className="text-xs text-gray-400">UID: {selectedPost.author?.uid || selectedPost.authorId}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-6">
                {selectedPost.title && (
                  <h3 className="text-lg poppins-semibold text-gray-800 mb-2">{selectedPost.title}</h3>
                )}
                <p className="text-gray-700 poppins-regular whitespace-pre-wrap">
                  {selectedPost.content || "No content"}
                </p>
              </div>

              {/* Post Image */}
              {selectedPost.imageUrl && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 poppins-regular mb-2">Post Image</p>
                  <img 
                    src={selectedPost.imageUrl} 
                    alt="Post image"
                    className="w-full max-h-80 object-contain rounded-lg border bg-gray-50"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <p className="text-2xl poppins-bold text-red-600">{selectedPost.likes || 0}</p>
                  <p className="text-sm text-red-500">Likes</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl poppins-bold text-blue-600">{selectedPost.comments || 0}</p>
                  <p className="text-sm text-blue-500">Comments</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Post ID</p>
                    <p className="poppins-medium text-gray-700 font-mono text-xs">{selectedPost.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created At</p>
                    <p className="poppins-medium text-gray-700">{formatDate(selectedPost.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end rounded-b-lg">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 poppins-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManagement;
