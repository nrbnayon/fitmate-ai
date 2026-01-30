// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // Get user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  // If user is authenticated, redirect to their dashboard
  if (accessToken && userRole) {
    switch (userRole) {
      case "admin":
        redirect("/dashboard");
      default:
        redirect("/signin");
    }
  }

  // If not authenticated, redirect to public landing page
  redirect("/signin");
}