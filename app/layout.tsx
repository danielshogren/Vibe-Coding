import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Tracker",
  description: "Minimal project tracker + date list",
};

/** Root layout: wraps all pages with shared HTML and styles. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
