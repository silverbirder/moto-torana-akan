import "~/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "元とらなアカン",
  description: "元とらなもったいないやん！",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/apple-touch-icon.png"
        ></link>
        <link rel="icon" type="image/png" href="/icon-192x192.png"></link>
      </head>
      <body>
        <main>{children}</main>
        <footer className="border-t bg-muted/20 py-4">
          <div className="flex items-center justify-between px-4 md:px-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 silverbirder. All rights reserved.
            </p>
            <nav className="flex items-center gap-4">
              <Link
                href="https://forms.gle/zWxurt3y3AHHiw4JA"
                className="text-sm transition-colors hover:text-primary"
                target="_blank"
                prefetch={false}
              >
                Contact
              </Link>
            </nav>
          </div>
        </footer>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
      </body>
    </html>
  );
}
