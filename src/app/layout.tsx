import type { Metadata } from "next";
import "./globals.css";
import Navigation from '@/components/layout/Navigation'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Tagcord.gg - Discord Tag Explorer",
  description: "Discover and share amazing Discord communities with our modern tag explorer.",
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
  manifest: '/favicons/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Navigation />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--foreground)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--foreground)',
              },
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
