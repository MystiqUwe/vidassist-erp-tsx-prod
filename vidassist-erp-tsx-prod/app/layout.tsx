import SupabaseProvider from "@/providers/supabase-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Suparepo",
  description: "A repo for Next.js (App Router) + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
