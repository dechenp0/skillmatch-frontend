"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Target, LayoutGrid, User, Search, History, LogOut, X } from "lucide-react";
import { logoutUser } from "@/services/auth";
import { getInitials } from "./UserContext";

const NAV = [
  { label: "Overview", href: "/userdashboard/dashboard", icon: LayoutGrid },
  { label: "My Profile & CV", href: "/userdashboard/profile", icon: User },
  { label: "Find Matches", href: "/userdashboard/matches", icon: Search },
  { label: "History", href: "/userdashboard/history", icon: History },
];

export default function Sidebar({ user, open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      router.replace("/auth/login");
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between overflow-hidden bg-gradient-to-b from-primary via-primary-container to-inverse-surface text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary-fixed/15 blur-3xl" />

        <div className="relative">
          <div className="flex h-16 items-center justify-between px-5">
            <Link href="/userdashboard/dashboard" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Target size={20} strokeWidth={2.2} />
              </span>
              <span className="text-title-md tracking-tight">MatchYourSkills</span>
            </Link>
            <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-1.5 text-primary-fixed hover:bg-white/10 lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Dashboard">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md transition-colors ${
                    active
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-primary-fixed hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative p-3">
          <div className="flex flex-col gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-label-md text-primary">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-label-md text-white">{user.name}</p>
                <p className="truncate text-body-sm text-primary-fixed-dim">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-label-md text-primary-fixed transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} /> Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}