// redux/services/userApi.ts
import { apiSlice } from "../features/apiSlice";
import { 
    UserListResponse, 
    UserDetailsResponse, 
    CreatorListResponse, 
    CreatorDetailsResponse,
    DeleteUserResponse
} from "@/types/userManagement.types";
import { 
    CommissionTrackingResponse 
} from "@/types/commissionTracking";
import { 
    PolicyListResponse, 
    SinglePolicyResponse, 
    PolicyMutationPayload 
} from "@/types/policies";
import type { ApiResponse } from "@/types/auth.types";

export const userApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // 1. Get all users (Regular Users)
        getUsers: builder.query<UserListResponse, { page: number, page_size: number, search?: string }>({
            query: ({ page, page_size, search }) => ({
                url: "/auth/users/",
                params: {
                    page,
                    page_size,
                    search: search || undefined
                }
            }),
            providesTags: (result) => 
                result?.data?.results 
                    ? [...result.data.results.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // 2. Get Single User Details
        getUserDetails: builder.query<UserDetailsResponse, string>({
            query: (uuid) => `/auth/users/${uuid}/`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // 3. Get Creator List
        getCreators: builder.query<CreatorListResponse, { page: number, page_size: number, search?: string }>({
            query: ({ page, page_size, search }) => ({
                url: "/auth/users-creators/",
                params: {
                    page,
                    page_size,
                    search: search || undefined
                }
            }),
            providesTags: (result) => 
                result?.data?.results 
                    ? [...result.data.results.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // 4. Get Creator Details
        getCreatorDetails: builder.query<CreatorDetailsResponse, string>({
            query: (uuid) => `/auth/users-creators/${uuid}/`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // 5. Delete User
        deleteUser: builder.mutation<DeleteUserResponse, string>({
            query: (uuid) => ({
                url: `/auth/users/${uuid}/`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id: 'LIST' },
                { type: 'User', id },
                "Dashboard" // Invalidate dashboard since user count/stats might change
            ],
        }),

        // 6. Get Commission Tracking
        getCommissionTracking: builder.query<CommissionTrackingResponse, { page?: number, page_size?: number, search?: string }>({
            query: ({ page = 1, page_size = 10, search } = {}) => ({
                url: "/profile/commissions/",
                params: {
                    page,
                    page_size,
                    search: search || undefined
                }
            }),
            providesTags: (result) => 
                result?.data?.table?.commissions 
                    ? [{ type: 'Commission' as const, id: 'LIST' }]
                    : [{ type: 'Commission', id: 'LIST' }],
        }),

        // 7. Get Policies
        getPolicies: builder.query<PolicyListResponse, void>({
            query: () => "/profile/policies/",
            providesTags: (result) =>
                result?.data && Array.isArray(result.data) ? [
                    ...result.data.map(({ id }) => ({ type: 'Policy' as const, id })),
                    { type: 'Policy', id: 'LIST' }
                ] : [{ type: 'Policy', id: 'LIST' }],
        }),

        // 8. Create Policy
        createPolicy: builder.mutation<SinglePolicyResponse, PolicyMutationPayload>({
            query: (payload) => ({
                url: "/profile/policies/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [{ type: 'Policy', id: 'LIST' }],
        }),

        // 9. Update Policy
        updatePolicy: builder.mutation<SinglePolicyResponse, { id: number; payload: PolicyMutationPayload }>({
            query: ({ id, payload }) => ({
                url: `/profile/policies/${id}/`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Policy', id },
                { type: 'Policy', id: 'LIST' }
            ],
        }),

        // 10. Delete Policy
        deletePolicy: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({
                url: `/profile/policies/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'Policy', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useGetCreatorsQuery,
    useGetCreatorDetailsQuery,
    useDeleteUserMutation,
    useLazyGetUserDetailsQuery,
    useLazyGetCreatorDetailsQuery,
    useGetCommissionTrackingQuery,
    useGetPoliciesQuery,
    useCreatePolicyMutation,
    useUpdatePolicyMutation,
    useDeletePolicyMutation,
} = userApi;
