import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SprintOne To-Do",
  description: "A minimalist, distraction-free task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
