import { supabase } from "@/utils/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

function getAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("supabase_access_token") || "";
}

/**
 * Create a new user via the Admin User Edge Function
 * This function ensures:
 * 1. Auth user is created securely on the server using admin API
 * 2. User profile is inserted into public.users table
 * 3. The current admin session is NOT logged out
 */
export const createAdminUser = async ({
  email,
  password,
  firstName,
  lastName,
  role,
  avatarFile,
}) => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Not authenticated. Please log in first.");
    }

    // If an avatar file is provided, convert to base64 so the Edge Function can upload it securely
    let avatarBase64 = null;
    let avatarName = null;
    let avatarType = null;

    if (avatarFile) {
      avatarName = avatarFile.name;
      avatarType = avatarFile.type;
      avatarBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(avatarFile);
      });
    }

    // Call the Edge Function with auth token
    const response = await fetch(`${supabaseUrl}/functions/v1/create-admin-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role,
        avatarName,
        avatarType,
        avatarBase64,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create user");
    }

    return {
      success: true,
      userId: data.userId,
      email: data.email,
      message: data.message,
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 number
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  return null; // Valid
};
