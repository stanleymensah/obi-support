# Admin User Creation Flow - Setup Guide

## Overview

This implementation provides a secure Admin-only User Creation flow that:

✅ Uses Supabase Admin Auth API (`auth.admin.createUser()`) to create users server-side
✅ Doesn't create a session for the new user (admin stays logged in)
✅ Stores passwords securely in Supabase Auth (NOT in public tables)
✅ Validates that only admins can create new users
✅ Includes comprehensive error handling and rollback logic

---

## Architecture

### 1. **Supabase Edge Function** (`supabase/functions/create-admin-user/index.ts`)
- **Location**: Server-side (Deno runtime)
- **Security**: Uses `SUPABASE_SERVICE_ROLE_KEY` (never exposed to frontend)
- **Responsibilities**:
  - Authenticate the request (verify JWT token)
  - Check if caller is an admin
  - Call `auth.admin.createUser()` with email & password
  - Insert user profile into `public.users` table
  - Handle rollback if profile insertion fails

### 2. **Frontend API Service** (`src/services/adminUserService.js`)
- **Location**: Client-side
- **Public APIs**:
  - `createAdminUser()` - Calls Edge Function securely
  - `isValidEmail()` - Email validation helper
  - `validatePassword()` - Password strength validator

### 3. **React Form Component** (`src/pages/users/CreateUserForm.jsx`)
- **Location**: Client-side
- **Features**:
  - Clean form with First Name, Last Name, Email, Role, Password fields
  - Real-time validation using react-hook-form
  - Loading state management
  - Error toast notifications
  - Form reset on success

---

## Setup Instructions

### Step 1: Create Environment Variables

Supabase Edge Functions use environment variables automatically. Verify your `.env` file has:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

**Note**: The Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` which is automatically injected by Supabase. You don't need to set it manually.

### Step 2: Deploy the Edge Function

#### Prerequisites
- Install Supabase CLI: `npm install -g supabase`
- You must be authenticated: `supabase login`

#### Deploy
```bash
# Navigate to your project root
cd your-ticket-app

# Deploy the function
supabase functions deploy create-admin-user --project-id YOUR_PROJECT_ID
```

Or set the default project:
```bash
supabase projects list  # Get your project ID
supabase link --project-id YOUR_PROJECT_ID

# Then deploy
supabase functions deploy create-admin-user
```

#### Verify Deployment
```bash
supabase functions list --project-id YOUR_PROJECT_ID
```

### Step 3: Database Setup

Ensure your `public.users` table has these columns:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'support', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- ... other columns you need
);
```

### Step 4: Row-Level Security (RLS) Policy

Ensure only admins can create users. Add this policy:

```sql
-- Allow admins to insert new users
CREATE POLICY "Admins can create users"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );
```

### Step 5: Test the Implementation

1. **Login as an Admin**
2. Navigate to Users → Add New User
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@company.com`
   - Role: `admin` / `support` / `user`
   - Password: `SecurePass123` (must be 8+ chars, 1 uppercase, 1 number)
4. Click "Create User"

**Expected Results**:
- ✅ Toast notification: "User created successfully"
- ✅ New user appears in the users list
- ✅ Admin remains logged in
- ✅ New user can log in with their email and temporary password

---

## Security Architecture

### Defense in Depth

| Layer | Mechanism | Protection |
|-------|-----------|-----------|
| **Authentication** | JWT Token from Supabase | Verifies caller is logged in |
| **Authorization** | Role check in Edge Function | Only admins can create users |
| **Password Security** | `auth.admin.createUser()` with `email_confirm: true` | Never stored in public tables |
| **Data Consistency** | Rollback on failure | If profile insert fails, auth user is deleted |
| **Input Validation** | Client + Server validation | Email format, password strength |
| **Environment Secrets** | `SUPABASE_SERVICE_ROLE_KEY` | Hidden from frontend, only in Edge Function |

### How Passwords Are Handled

```
User submits form
         ↓
Client validates password strength locally
         ↓
Send email + password + firstName/lastName to Edge Function via HTTPS
         ↓
Edge Function receives request (password is in transit, encrypted by HTTPS)
         ↓
supabaseAdmin.auth.admin.createUser() is called
         ↓
Supabase Auth system stores password securely (hashed, salted, never in public tables)
         ↓
Edge Function receives user.id from Auth response
         ↓
User profile inserted into public.users table (NO PASSWORD STORED HERE)
         ↓
Response sent back to client
         ↓
Admin's session continues (no new session created for new user)
```

### Why This is Secure

❌ **Never do this**: Store passwords in your public tables
❌ **Never do this**: Use standard `/auth/v1/signup` (creates a session for new user)
❌ **Never do this**: Pass `SERVICE_ROLE_KEY` to frontend

✅ **We do this**: Passwords stay in Supabase Auth system (not your tables)
✅ **We do this**: Use server-side admin API to create users without sessions
✅ **We do this**: Keep `SERVICE_ROLE_KEY` on server only (Edge Function)

---

## API Reference

### Edge Function Endpoint

**Endpoint**: `POST /functions/v1/create-admin-user`

**Headers**:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <USER_JWT_TOKEN>"
}
```

**Request Body**:
```javascript
{
  "email": "john.doe@company.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin" | "support" | "user"
}
```

**Success Response (201)**:
```javascript
{
  "success": true,
  "message": "User created successfully",
  "userId": "uuid-here",
  "email": "john.doe@company.com"
}
```

**Error Response (400/401/403/500)**:
```javascript
{
  "error": "Error message explaining what went wrong"
}
```

**Error Cases**:
- `401 Unauthorized` - No auth token provided
- `403 Forbidden` - Caller is not an admin
- `400 Bad Request` - Missing fields, invalid email, weak password, email already exists
- `500 Internal Server Error` - Unexpected error (check logs)

### Frontend Service

#### `createAdminUser(data)`
```javascript
import { createAdminUser } from '@/services/adminUserService';

const result = await createAdminUser({
  email: "john@company.com",
  password: "SecurePass123",
  firstName: "John",
  lastName: "Doe",
  role: "admin"
});

console.log(result.userId); // UUID of created user
console.log(result.email);  // Email of created user
```

#### `isValidEmail(email)`
```javascript
import { isValidEmail } from '@/services/adminUserService';

isValidEmail("john@company.com");  // true
isValidEmail("invalid-email");     // false
```

#### `validatePassword(password)`
```javascript
import { validatePassword } from '@/services/adminUserService';

validatePassword("weak");          // "Password must be at least 8 characters long"
validatePassword("SecurePass123"); // null (valid)
```

---

## Troubleshooting

### Function not found (404)

**Problem**: Getting 404 when calling the Edge Function
**Solution**:
1. Verify function is deployed: `supabase functions list`
2. Check function URL: Should be `https://your-project.supabase.co/functions/v1/create-admin-user`
3. Ensure you're using the correct project ID

### Authentication failed (401)

**Problem**: Getting "Unauthorized" error
**Solution**:
1. Ensure user is logged in before creating new users
2. Verify JWT token is being sent in Authorization header
3. Check token isn't expired (should auto-refresh)

### Only admins can create (403)

**Problem**: Getting "Only admins can create users" error
**Solution**:
1. Verify the current user's role in the `public.users` table
2. Ensure the user has `role = 'admin'`
3. Check RLS policies on the table

### Password insertion failed (400)

**Problem**: Getting error about profile insertion failing
**Solution**:
1. Check if email already exists in `public.users`
2. Verify `public.users` table structure matches expectations
3. Check database constraints and triggers

### Check Edge Function Logs

In Supabase dashboard:
1. Go to **Functions** → **create-admin-user**
2. Click **Logs** tab
3. Look for error messages and stack traces

---

## Next Steps (Optional Enhancements)

### 1. Send Welcome Email
Add this to the Edge Function after user creation:
```typescript
await supabaseAdmin.auth.admin.updateUserById(newAuthUser.id, {
  user_metadata: { temp_password_sent: true }
});

// Send email with temporary password
```

### 2. Require Password Change on First Login
Add a `requires_password_change` flag to `public.users`:
```sql
ALTER TABLE public.users ADD COLUMN requires_password_change BOOLEAN DEFAULT true;
```

### 3. Audit Logging
Log all user creation events:
```sql
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT,
  created_by UUID REFERENCES public.users(id),
  target_user_id UUID REFERENCES public.users(id),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Bulk User Import
Create another Edge Function to import multiple users at once.

---

## File Structure

```
project-root/
├── supabase/
│   └── functions/
│       └── create-admin-user/
│           └── index.ts              ← Edge Function (server)
├── src/
│   ├── services/
│   │   └── adminUserService.js      ← API service layer
│   └── pages/
│       └── users/
│           └── CreateUserForm.jsx    ← React component
└── .env                              ← Supabase URL & keys
```

---

## Questions?

- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Admin Auth API**: https://supabase.com/docs/reference/javascript/auth-admin-createuser

