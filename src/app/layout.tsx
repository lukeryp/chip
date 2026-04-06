import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHIP — Golf Fitness Tracker",
  description:
    "Golf-specific workouts: strength, speed, power, and mobility training to improve your game.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CHIP — Golf Fitness Tracker",
    description: "Train like your game depends on it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-text font-work-sans antialiased">
        {children}
      </body>
    </html>
  );
}
