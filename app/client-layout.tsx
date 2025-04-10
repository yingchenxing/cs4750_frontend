"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, Search, MessageSquare, Users } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const navItems = [
  {
    title: "Home",
    icon: <Home className="h-5 w-5" />,
    href: "/",
  },
  {
    title: "Listings",
    icon: <Search className="h-5 w-5" />,
    href: "/listings",
  },
  {
    title: "Roommates",
    icon: <Users className="h-5 w-5" />,
    href: "/roommates",
  },
  {
    title: "Messages",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/messages",
  },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen pb-20">
      {children}
      <FloatingDock
        items={navItems}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-4 right-4 z-50"
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </div>
  );
} 