// EXAMPLES OF EXTENDING THE IMPLEMENTATION

/**
 * This file shows common extensions to the basic admin user creation flow.
 * Copy and adapt these examples for your needs.
 */

// ==============================================================================
// EXTENSION 1: SEND WELCOME EMAIL
// ==============================================================================

/**
 * Update supabase/functions/create-admin-user/index.ts
 * 
 * Add this after successful user creation:
 */

/* ADD TO Edge Function:

import { Resend } from "https://esm.sh/resend@3.0.0";

// At the top of the function:
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// After successful profile insert:
const { error: emailError } = await resend.emails.send({
  from: "admin@ticket-app.com",
  to: payload.email,
  subject: "Welcome to Ticket App",
  html: `
    <h1>Welcome, ${payload.firstName}!</h1>
    <p>Your account has been created.</p>
    <p>Email: ${payload.email}</p>
    <p>Temporary Password: ${payload.password}</p>
    <p><strong>Please change your password on first login.</strong></p>
    <a href="https://ticket-app.com/login">Login Here</a>
  `,
});

if (emailError) {
  console.error("Failed to send email:", emailError);
  // Don't fail the whole operation if email fails
  // User is already created, they just won't get email
}

*/

// ==============================================================================
// EXTENSION 2: REQUIRE PASSWORD CHANGE ON FIRST LOGIN
// ==============================================================================

/**
 * 1. Add column to public.users table:
 */

const sqlScript = `
ALTER TABLE public.users ADD COLUMN requires_password_change BOOLEAN DEFAULT true;
`;

/**
 * 2. Update Edge Function to set flag:
 */

const insertPayload = {
  id: newAuthUser.id,
  first_name: payload.firstName,
  last_name: payload.lastName,
  email: payload.email,
  role: payload.role,
  requires_password_change: true, // Add this
};

/**
 * 3. Check flag on login (in your Auth Context or dashboard):
 */

export const useCheckPasswordChange = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      checkIfPasswordChangeRequired(session.user.id);
    }
  }, [session]);

  const checkIfPasswordChangeRequired = async (userId) => {
    const { data } = await supabase
      .from("users")
      .select("requires_password_change")
      .eq("id", userId)
      .single();

    if (data?.requires_password_change) {
      navigate("/change-password", {
        state: { reason: "first_login" }
      });
    }
  };
};

/**
 * 4. Create password change form:
 */

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Update Supabase Auth password
      const { error: authError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (authError) throw authError;

      // Mark password change as complete
      const { error: dbError } = await supabase
        .from("users")
        .update({ requires_password_change: false })
        .eq("id", supabase.auth.user().id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      navigate("/dashboard");
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <h1>Set Your Password</h1>
      <p>This is your first login. Please set a secure password.</p>
      
      <input
        {...register("currentPassword", { required: true })}
        type="password"
        placeholder="Current password"
      />
      
      <input
        {...register("newPassword", { required: true })}
        type="password"
        placeholder="New password"
      />
      
      <input
        {...register("confirmPassword", { required: true })}
        type="password"
        placeholder="Confirm password"
      />
      
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

// ==============================================================================
// EXTENSION 3: AUDIT LOGGING
// ==============================================================================

/**
 * 1. Create audit table:
 */

const createAuditTable = `
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id),
  target_user_id UUID REFERENCES public.users(id),
  target_email TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast querying
CREATE INDEX idx_audit_logs_created_by ON public.audit_logs(created_by);
CREATE INDEX idx_audit_logs_target_user ON public.audit_logs(target_user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
`;

/**
 * 2. Update Edge Function to log creation:
 */

// After successful profile insert:
const { error: auditError } = await supabaseAdmin
  .from("audit_logs")
  .insert({
    action: "user_created",
    created_by: user.id,
    target_user_id: newAuthUser.id,
    target_email: payload.email,
    details: {
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
    ip_address: req.headers.get("x-forwarded-for") || "unknown",
    user_agent: req.headers.get("user-agent") || "unknown",
  });

if (auditError) {
  console.error("Failed to create audit log:", auditError);
}

/**
 * 3. View audit logs in your dashboard:
 */

export const AuditLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select(`
          id,
          action,
          created_by (first_name, last_name),
          target_email,
          details,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      return data;
    },
  });

  return (
    <div>
      <h2>Audit Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Admin</th>
            <th>Target Email</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs?.map((log) => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{log.created_by.first_name} {log.created_by.last_name}</td>
              <td>{log.target_email}</td>
              <td>{JSON.stringify(log.details)}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==============================================================================
// EXTENSION 4: BULK USER IMPORT
// ==============================================================================

/**
 * Create a new Edge Function: create-users-bulk
 */

// supabase/functions/create-users-bulk/index.ts

interface BulkCreatePayload {
  users: Array<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "admin" | "support" | "user";
  }>;
}

// In the Edge Function:
const payload = await req.json() as BulkCreatePayload;

const results = [];
for (const userToCreate of payload.users) {
  try {
    // Call the same logic as single user creation
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email: userToCreate.email,
      password: userToCreate.password,
      email_confirm: true,
    });

    if (error) {
      results.push({
        email: userToCreate.email,
        success: false,
        error: error.message,
      });
      continue;
    }

    // Insert profile
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .insert({
        id: user.id,
        first_name: userToCreate.firstName,
        last_name: userToCreate.lastName,
        email: userToCreate.email,
        role: userToCreate.role,
      });

    results.push({
      email: userToCreate.email,
      success: !dbError,
      error: dbError?.message,
    });
  } catch (error) {
    results.push({
      email: userToCreate.email,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

return new Response(JSON.stringify({ results }), { status: 201 });

/**
 * Frontend component for CSV import:
 */

export const BulkUserImport = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<any[]>([]);
  const mutation = useMutation({
    mutationFn: async (users) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-users-bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ users }),
        }
      );
      return response.json();
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Parse CSV
    const text = await file.text();
    const lines = text.split("\n");
    const users = lines.slice(1).map((line) => {
      const [email, password, firstName, lastName, role] = line.split(",");
      return { email, password, firstName, lastName, role };
    });

    setPreview(users);
  };

  return (
    <div>
      <h2>Bulk Import Users</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      
      {preview.length > 0 && (
        <>
          <h3>Preview ({preview.length} users)</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button
            onClick={() => mutation.mutate(preview)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Importing..." : "Import Users"}
          </button>
        </>
      )}
    </div>
  );
};

// Expected CSV format:
// email,password,firstName,lastName,role
// john@company.com,SecurePass123,John,Doe,admin
// jane@company.com,SecurePass456,Jane,Smith,support

// ==============================================================================
// EXTENSION 5: INVITATION LINKS
// ==============================================================================

/**
 * 1. Create invitations table:
 */

const createInvitationsTable = `
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_email ON public.invitations(email);
`;

/**
 * 2. Create invite Edge Function:
 */

// supabase/functions/create-user-invitation/index.ts

const { randomUUID } = await import("https://deno.land/std@0.182.0/uuid/mod.ts");

const invitationToken = randomUUID();
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

const { error } = await supabaseAdmin
  .from("invitations")
  .insert({
    email: payload.email,
    token: invitationToken,
    role: payload.role,
    created_by: user.id,
    expires_at: expiresAt.toISOString(),
  });

// Send email with invite link
const inviteLink = `https://ticket-app.com/accept-invitation?token=${invitationToken}`;

/**
 * 3. Accept invitation page:
 */

export const AcceptInvitation = () => {
  const { token } = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = React.useState(null);

  React.useEffect(() => {
    const fetchInvitation = async () => {
      const { data } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .single();

      if (data && new Date(data.expires_at) > new Date()) {
        setInvitation(data);
      } else {
        navigate("/", { state: { error: "Invitation expired" } });
      }
    };
    fetchInvitation();
  }, [token]);

  const handleAccept = async (password: string) => {
    // Create auth user with the invited email
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    // Create profile
    await supabase.from("users").insert({
      id: user.id,
      email: invitation.email,
      role: invitation.role,
      first_name: "",
      last_name: "",
    });

    // Mark invitation as accepted
    await supabase
      .from("invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invitation.id);

    navigate("/login");
  };

  return (
    <div>
      <h1>Accept Invitation</h1>
      <p>You've been invited to join as a {invitation?.role}</p>
      <SetPasswordForm onSubmit={handleAccept} />
    </div>
  );
};

// ==============================================================================
// EXTENSION 6: FINE-GRAINED PERMISSIONS
// ==============================================================================

/**
 * Instead of just admin/support/user roles, add detailed permissions:
 */

const createPermissionsTable = `
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, resource, action)
);

-- Resources: 'users', 'tickets', 'analytics', 'settings'
-- Actions: 'create', 'read', 'update', 'delete'
`;

/**
 * Define role templates:
 */

const rolePermissions = {
  admin: [
    { resource: "users", action: "create" },
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "tickets", action: "create" },
    { resource: "tickets", action: "read" },
    { resource: "tickets", action: "update" },
    { resource: "tickets", action: "delete" },
    { resource: "analytics", action: "read" },
    { resource: "settings", action: "update" },
  ],
  support: [
    { resource: "tickets", action: "read" },
    { resource: "tickets", action: "update" },
    { resource: "users", action: "read" },
  ],
  user: [
    { resource: "tickets", action: "create" },
    { resource: "tickets", action: "read" },
  ],
};

/**
 * Check permissions in your components:
 */

export const usePermission = (resource: string, action: string) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    const checkPermission = async () => {
      const { count } = await supabase
        .from("permissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("resource", resource)
        .eq("action", action);

      setHasPermission((count ?? 0) > 0);
    };

    if (user?.id) checkPermission();
  }, [user?.id, resource, action]);

  return hasPermission;
};

// Usage:
export const DeleteUserButton = ({ userId }) => {
  const canDelete = usePermission("users", "delete");

  if (!canDelete) return null;

  return <button onClick={() => deleteUser(userId)}>Delete</button>;
};

export {};
