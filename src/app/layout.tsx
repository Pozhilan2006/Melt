import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "MEELT! — Location-Aware Community & Real-World Discovery Platform",
  description: "Discover real people, vibrant communities, shared interests, and high-hype activities around you in Hyderabad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neo-bg text-neo-dark antialiased selection:bg-neo-yellow selection:text-black">
        <AuthProvider>
          {/* Header Navigation */}
          <Header />

          {/* Global Neo-Brutalist Grid Background Pattern */}
          <div className="fixed inset-0 bg-brutal-grid opacity-20 pointer-events-none z-0" />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 z-10 relative">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
