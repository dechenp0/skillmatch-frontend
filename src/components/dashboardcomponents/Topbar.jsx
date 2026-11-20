"use client";
import { Menu } from "lucide-react";
import { getInitials } from "./UserContext";

export default function Topbar({ user, onMenu }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-surface/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:px-8 lg:left-64">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenu} aria-label="Open menu" className="rounded-lg p-2 text-on-surface lg:hidden">
          <Menu size={22} />
        </button>
        <span className="text-headline-sm text-on-surface">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-label-md text-on-surface sm:block">{user.name}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-md text-on-primary">
          {getInitials(user.name)}
        </span>
      </div>
    </header>
  );
}