"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { UserProvider } from "@/components/dashboardcomponents/UserContext";
import Sidebar from "@/components/dashboardcomponents/Sidebar";
import Topbar from "@/components/dashboardcomponents/Topbar";

// Wraps every page inside /userdashboard. It asks Django who is logged in
// (GET /api/auth/me/). If nobody is, the visitor is sent to the login page.
export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((u) => {
        if (!active) return;
        setUser(u);
        setStatus("ready");
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401 || err.status === 403) router.replace("/auth/login");
        else setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [router, attempt]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary-fixed border-t-primary-container" aria-label="Loading" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <h1 className="text-headline-sm">We could not reach the server</h1>
        <p className="max-w-sm text-body-md text-on-surface-variant">
          Check that the Django backend is running, then try again.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }}
            className="rounded-xl bg-primary-container px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary"
          >
            Try again
          </button>
          <Link href="/auth/login" className="rounded-xl bg-surface-container px-5 py-2.5 text-label-md text-on-surface">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <UserProvider value={user}>
      <div className="min-h-screen bg-surface">
        <Sidebar user={user} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <Topbar user={user} onMenu={() => setMenuOpen(true)} />
        <main className="px-4 pb-10 pt-24 sm:px-8 lg:pl-72">{children}</main>
      </div>
    </UserProvider>
  );
}