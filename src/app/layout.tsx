import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Quest",
  description:
    "A Kahoot + Cookie Clicker style game: answer food & sustainability questions, then grow your own garden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
