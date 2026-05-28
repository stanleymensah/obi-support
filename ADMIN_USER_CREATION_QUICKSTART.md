# Quick Start Checklist

## Pre-Deployment Checklist

- [ ] **Supabase CLI Installed**: `npm install -g supabase`
- [ ] **Authenticated with Supabase**: `supabase login`
- [ ] **Project ID Known**: Run `supabase projects list` to find it
- [ ] **Environment Variables Set**: `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] **Public.users Table Exists**: With columns `id, first_name, last_name, email, role`

## Deployment Steps (5 minutes)

### 1. Link Your Project
```bash
supabase link --project-id YOUR_PROJECT_ID
```

### 2. Deploy the Edge Function
```bash
supabase functions deploy create-admin-user
```

### 3. Verify Deployment
```bash
supabase functions list
```
You should see `create-admin-user` in the list.

### 4. Verify RLS Policy (if needed)

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check if admins can insert users
CREATE POLICY "Admins can create users"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );
```

### 5. Test in Your App

1. Login as Admin
2. Go to Users page
3. Click "Add New User"
4. Fill form and submit
5. Should see success toast

---

## Environment Variables

Your `.env` file should have:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get these from**:
Supabase Dashboard → Project Settings → API Keys

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Function not found (404) | Run `supabase functions list` to verify deployment |
| Auth fails (401) | Make sure you're logged in before creating users |
| Only admins can create (403) | Check your user role in public.users table |
| Email already exists (400) | Try a different email address |
| Password too weak (400) | Password needs: 8+ chars, 1 uppercase, 1 number |

---

## Files Modified/Created

✅ `supabase/functions/create-admin-user/index.ts` - Edge Function
✅ `src/services/adminUserService.js` - API service layer
✅ `src/pages/users/CreateUserForm.jsx` - Updated React component (now uses Edge Function)

---

## What Changed vs. Old Implementation

| Aspect | Old | New |
|--------|-----|-----|
| User Creation | Client-side `/auth/v1/signup` | Server-side `auth.admin.createUser()` |
| Session Impact | Creates session for new user | No session (admin stays logged in) |
| Password Storage | Public.users table | Supabase Auth only |
| Authorization Check | None | Only admins can create users |
| Error Rollback | No | Yes (deletes auth user if profile insert fails) |
| Validation | Basic regex | Comprehensive password strength checks |

---

## Production Ready Features

✅ HTTPS encryption for password in transit
✅ JWT authentication on Edge Function
✅ Role-based authorization
✅ Comprehensive error handling
✅ Input validation (client + server)
✅ Automatic rollback on failures
✅ Password strength requirements
✅ Email format validation
✅ Toast notifications for user feedback
✅ Loading states
✅ Form validation with react-hook-form

