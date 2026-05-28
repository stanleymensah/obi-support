import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "support" | "user";
  avatarBase64?: string | null;
  avatarName?: string | null;
  avatarType?: string | null;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // Verify the request is authenticated (optional but recommended)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401);
    }

    // Verify the user calling this function is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // Check if caller is admin (verify in public.users table)
    const { data: adminUser, error: roleError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || adminUser?.role !== "admin") {
      return jsonResponse({ error: "Only admins can create users" }, 403);
    }

    // Parse request body
    const payload: CreateUserPayload = await req.json();

    // Validate input
    if (!payload.email || !payload.password || !payload.firstName || !payload.lastName) {
      return jsonResponse(
        { error: "Missing required fields: email, password, firstName, lastName" },
        400,
      );
    }

    if (!["admin", "support", "user"].includes(payload.role)) {
      return jsonResponse(
        { error: "Invalid role. Must be one of: admin, support, user" },
        400,
      );
    }

    // Create auth user using admin API
    const { data: { user: newAuthUser }, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authCreateError || !newAuthUser?.id) {
      return jsonResponse(
        { error: authCreateError?.message || "Failed to create auth user" },
        400,
      );
    }

    // If avatar provided, upload it to storage and build public URL
    let photoUrl = null;
    if (payload.avatarBase64 && payload.avatarName) {
      try {
        const fileBytes = Uint8Array.from(atob(payload.avatarBase64), (c) => c.charCodeAt(0));
        const path = `avatars/${newAuthUser.id}/${payload.avatarName}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("avatars")
          .upload(path, fileBytes, { contentType: payload.avatarType || "application/octet-stream", upsert: true });

        if (uploadError) {
          console.warn("Avatar upload failed:", uploadError.message);
        } else {
          const { data } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);
          photoUrl = data?.publicUrl || null;
        }
      } catch (e) {
        console.error("Failed to process avatar:", e);
      }
    }

    // Insert user profile into public.users table
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .insert({
        id: newAuthUser.id,
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        role: payload.role,
        photo_url: photoUrl,
      });

    if (dbError) {
      // If profile insertion fails, we should delete the auth user to keep things consistent
      await supabaseAdmin.auth.admin.deleteUser(newAuthUser.id);
      return jsonResponse({ error: `Failed to create user profile: ${dbError.message}` }, 400);
    }

    return jsonResponse(
      {
        success: true,
        message: "User created successfully",
        userId: newAuthUser.id,
        email: payload.email,
      },
      201,
    );
  } catch (error) {
    console.error("Error in create-admin-user function:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500,
    );
  }
});
