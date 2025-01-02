import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { cn } from '@/lib/utils'
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "CareTrack",
  description: "CareTrack simplifies patient management by offering a secure platform for tracking patient information, and appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
