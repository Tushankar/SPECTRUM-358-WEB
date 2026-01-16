import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Reports', 'BlockedUsers', 'Stats', 'Posts', 'Users'],
  endpoints: (builder) => ({
    getAdminReports: builder.query({
      query: ({ page = 1, limit = 10 }) => `/api/posts/admin/reports?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.reports.map(({ id }) => ({ type: 'Reports', id })),
              { type: 'Reports', id: 'LIST' },
            ]
          : [{ type: 'Reports', id: 'LIST' }],
    }),
    getAdminBlockedUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => `/api/posts/admin/blocked-users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.blockedUsers.map(({ id }) => ({ type: 'BlockedUsers', id })),
              { type: 'BlockedUsers', id: 'LIST' },
            ]
          : [{ type: 'BlockedUsers', id: 'LIST' }],
    }),
    getAdminStats: builder.query({
      query: () => '/api/posts/admin/stats',
      providesTags: ['Stats'],
    }),
    deletePost: builder.mutation({
      query: ({ postId, postAuthorUserId }) => ({
        url: postAuthorUserId 
          ? `/api/posts/admin/posts/${postId}?postAuthorUserId=${postAuthorUserId}`
          : `/api/posts/admin/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports', 'Stats'],
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/api/posts/admin/users/${userId}/block`,
        method: 'POST',
        body: { blockerUserId: 'ADMIN_ACTION' },
      }),
      invalidatesTags: ['Reports', 'BlockedUsers', 'Stats'],
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/api/posts/admin/users/${userId}/unblock`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlockedUsers', 'Stats'], // Might affect reports too if we re-open them
    }),
    getAllPosts: builder.query({
      query: ({ page = 1, limit = 10 }) => `/api/posts/admin/all?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts', id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => `/api/auth/users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ uid }) => ({ type: 'Users', id: uid })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/api/auth/admin/register-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...updates }) => ({
        url: `/api/auth/users/${userId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' }
      ],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/auth/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, isActive }) => ({
        url: `/api/auth/users/${userId}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetAdminReportsQuery,
  useGetAdminBlockedUsersQuery,
  useGetAdminStatsQuery,
  useDeletePostMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllPostsQuery,
  useGetUsersQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} = apiSlice;
