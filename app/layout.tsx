import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, Search, Users, MessageSquare } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Housing",
  description: "Find your perfect student housing and roommates",
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen pb-20">
            {children}
            <FloatingDock
              items={navItems}
              desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
              mobileClassName="fixed bottom-4 right-4 z-50"
            />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
