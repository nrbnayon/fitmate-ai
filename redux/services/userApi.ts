// redux/services/userApi.ts
import { apiSlice } from "../features/apiSlice";
import { 
    UserListResponse, 
    UserDetailsResponse, 
    CreatorListResponse, 
    CreatorDetailsResponse,
    DeleteUserResponse
} from "@/types/userManagement.types";

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
} = userApi;
