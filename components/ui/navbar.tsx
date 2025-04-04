"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, Search, MessageSquare, Users } from "lucide-react";

// Mock auth state - replace with your actual auth state management
const isAuthenticated = false;

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative">
      <FloatingDock
        items={[
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
        ]}
      />
    </nav>
  );
} 