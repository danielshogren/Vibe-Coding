import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Project Tracker",
  description: "Minimal project tracker + date list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t&&t!=="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-surface text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
