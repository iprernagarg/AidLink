import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  ClipboardList,
  ListChecks,
  Sparkles,
  HeartHandshake,
  History,
  MessageSquare,
  User,
  Bell,
  Settings,
  LogOut,
  Home,
  X
} from "lucide-react";

export const SUPPORTER_NAV_ITEMS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "discover", label: "Discover campaigns", icon: Compass },
  { id: "workshops", label: "Workshops", icon: GraduationCap },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "commitments", label: "Commitments", icon: ListChecks },
  { id: "donations", label: "Donations", icon: HeartHandshake },
  { id: "impact", label: "My impact", icon: Sparkles },
  { id: "history", label: "History", icon: History },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function SupporterSidebar({ activeTab, onSelectTab, isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col bg-ink text-paper/90 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0 flex" : "-translate-x-full md:flex hidden"
        }`}
      >
        {/* Logo & Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-paper">
              AidLink
            </span>
            <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded-full font-medium">
              Supporter
            </span>
          </Link>
          {isOpen && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-paper/60 hover:text-paper hover:bg-white/10 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SUPPORTER_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onSelectTab(id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                  isActive
                    ? "bg-verified/25 text-white shadow-xs border-l-2 border-emerald-400"
                    : "text-paper/70 hover:bg-white/5 hover:text-paper"
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2 : 1.75} className={isActive ? "text-emerald-400" : ""} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/70 hover:bg-white/5 hover:text-paper transition-colors"
          >
            <Home size={17} strokeWidth={1.75} />
            <span>Public Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} strokeWidth={1.75} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
