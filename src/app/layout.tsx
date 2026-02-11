import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Toast from "@/components/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCM Admin",
  description: "SCM Capital Admin Dashboard",
  icons: {
    icon: "/scmLogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`} suppressHydrationWarning
      >
        <QueryProvider>
          <Toast />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
