import "~/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: true,
  },
  title: "元とらなアカン",
  description: "元とらなもったいないやん！",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["元とらなアカン", "値段計算"],
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
      <body className="flex min-h-screen flex-col">
        <main className="flex-grow bg-gradient-to-br from-orange-100 to-green-100">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-orange-500 to-green-500 py-4 text-white shadow-lg">
          <div className="flex flex-col items-center justify-between space-y-2 px-4 sm:flex-row sm:space-y-0 md:px-6">
            <p className="text-sm font-medium">
              &copy; 2024 silverbirder. All rights reserved.
            </p>
            <nav className="flex items-center">
              <Link
                href="https://forms.gle/zWxurt3y3AHHiw4JA"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-600"
                target="_blank"
                prefetch={false}
              >
                お問い合わせ
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
