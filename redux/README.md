# Redux Toolkit + RTK Query Setup Guide

## 📚 Overview

This project uses **Redux Toolkit** and **RTK Query** for state management and API integration. This setup provides:

- ✅ Type-safe state management
- ✅ Automatic API caching
- ✅ Easy REST API integration
- ✅ Optimistic updates
- ✅ Automatic refetching
- ✅ SEO-friendly (works with SSR/SSG)

## 🏗️ Project Structure

```
lib/redux/
├── store.ts                 # Redux store configuration
├── hooks.ts                 # Typed Redux hooks
├── StoreProvider.tsx        # Provider component for Next.js
├── features/
│   └── authSlice.ts        # Auth state slice
└── services/
    ├── apiSlice.ts         # Base API configuration
    ├── authApi.ts          # Auth API endpoints
    └── parcelApi.ts        # Parcel API endpoints
```

## 🚀 Quick Start

### 1. Using Redux State (Client Components)

```tsx
'use client';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials, logout } from '@/lib/redux/features/authSlice';

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogin = () => {
    dispatch(setCredentials({
      user: { email: 'user@example.com', role: 'customer' },
      token: 'your-token-here'
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Using API Queries (Fetching Data)

```tsx
'use client';
import { useTrackParcelQuery } from '@/lib/redux/services/parcelApi';

export default function TrackParcel() {
  const trackingCode = '547683241JH9P8P98654';
  
  // Automatically fetches data and handles loading/error states
  const { data, error, isLoading, refetch } = useTrackParcelQuery(trackingCode);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading parcel data</div>;

  return (
    <div>
      <h1>Tracking: {data?.trackingCode}</h1>
      <p>Status: {data?.status}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### 3. Using API Mutations (Creating/Updating Data)

```tsx
'use client';
import { useLoginMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/features/authSlice';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      
      // Save to Redux state
      dispatch(setCredentials({
        user: result.user,
        token: result.accessToken
      }));
      
      // Save to cookies for persistence
      document.cookie = `accessToken=${result.accessToken}`;
      
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit('user@example.com', 'password');
    }}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>Login failed</p>}
    </form>
  );
}
```

## 🔌 Connecting to Real API

### Step 1: Set API URL

Create/update `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### Step 2: API Endpoints Are Ready!

All API endpoints are already configured in:
- `lib/redux/services/authApi.ts` - Login, Signup, OTP verification
- `lib/redux/services/parcelApi.ts` - Track parcels, CRUD operations

### Step 3: Replace Dummy Data

Simply remove dummy data logic from components and use the hooks:

**Before (Dummy Data):**
```tsx
const [data, setData] = useState(null);
useEffect(() => {
  // Fake API call
  setTimeout(() => setData(dummyData), 1000);
}, []);
```

**After (Real API):**
```tsx
const { data, isLoading } = useTrackParcelQuery(trackingCode);
```

## 📝 Adding New API Endpoints

### Example: Add User Profile Endpoint

1. Create `lib/redux/services/userApi.ts`:

```tsx
import { apiSlice } from './apiSlice';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    
    updateUserProfile: builder.mutation<UserProfile, { id: string; data: Partial<UserProfile> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
```

2. Use in component:

```tsx
'use client';
import { useGetUserProfileQuery } from '@/lib/redux/services/userApi';

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfileQuery('user-123');
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Welcome, {profile?.name}</div>;
}
```

## 🎯 Best Practices

### 1. Use Typed Hooks
Always use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks.

### 2. Automatic Caching
RTK Query automatically caches data. Same queries won't refetch unless invalidated.

### 3. Cache Invalidation
Use `invalidatesTags` in mutations to auto-refetch related queries:

```tsx
createParcel: builder.mutation({
  query: (data) => ({ url: '/parcels', method: 'POST', body: data }),
  invalidatesTags: ['Parcel'], // Refetches all parcel queries
}),
```

### 4. Optimistic Updates
For instant UI updates before API response:

```tsx
updateParcel: builder.mutation({
  async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
    // Optimistically update cache
    const patchResult = dispatch(
      parcelApi.util.updateQueryData('getParcelById', id, (draft) => {
        Object.assign(draft, data);
      })
    );
    
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo(); // Rollback on error
    }
  },
}),
```

## 🔒 Authentication Flow

1. **Login** → Save token to Redux + cookies
2. **API Requests** → Auto-include token in headers (configured in `apiSlice.ts`)
3. **Logout** → Clear Redux state + cookies

## 📊 DevTools

Redux DevTools automatically work in development mode. Install the browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## 🚦 Migration Path

### Phase 1: Setup (✅ Done)
- Redux Toolkit installed
- Store configured
- Base API slice created

### Phase 2: Current (Using Dummy Data)
- Components use local state
- Dummy data in components

### Phase 3: API Integration (Easy Migration)
- Replace dummy data with RTK Query hooks
- No major refactoring needed
- Just swap `useState` with `useQuery`

### Phase 4: Production
- Connect to real backend
- Add error handling
- Implement retry logic

## 🎓 Learn More

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Next.js + Redux](https://redux-toolkit.js.org/usage/nextjs)

## 💡 Tips

1. **Server Components**: Can't use Redux hooks. Fetch data server-side and pass as props.
2. **Client Components**: Use `'use client'` directive to use Redux hooks.
3. **Hydration**: StoreProvider handles SSR hydration automatically.
4. **TypeScript**: Full type safety with auto-generated types from API responses.

---

**Ready to use!** Start by importing hooks in your components and replacing dummy data with API calls. 🚀
