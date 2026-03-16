import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/Themeprovider";

export const metadata: Metadata = {
  title: "Santos, Ralph Geo",
  description: "Full-Stack Developer · 4th Year CS Student",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}