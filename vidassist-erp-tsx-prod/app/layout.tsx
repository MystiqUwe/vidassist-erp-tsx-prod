import SupabaseProvider from "@/providers/supabase-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";

export const metadata = {
  title: "VidAssist ERP",
  description: "A Video Production ERP",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>{children}</SupabaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
