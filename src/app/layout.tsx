import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team DeCo — Project Portal",
  description: "Track project progress, milestones and live deployments with Team DeCo.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" }
    ],
    apple: "/apple-icon.png",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
