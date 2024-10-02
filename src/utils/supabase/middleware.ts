import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Define the type for the cookie
type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions; // Options are optional
};

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Cookie[]) { // Explicitly define the type for cookiesToSet
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set the cookie on the request object (if applicable)
            request.cookies.set(name, value); // This is correct if you want to set on the request
          });

          // Update the response with the new cookies
          cookiesToSet.forEach(({ name, value, options }) => {
            // Use the response object to set cookies
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Return the response after setting cookies
  return supabaseResponse;
};
