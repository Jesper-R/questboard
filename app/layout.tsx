import type { Metadata } from "next";
import { Geist, Geist_Mono, Jacquard_12 } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jacquard = Jacquard_12({
  weight: "400",
  variable: "--font-jacquard",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuestBoard",
  description: "Gamified habit & productivity tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/onboarding"}
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${jacquard.variable} antialiased`}
        >
          <SupabaseProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
