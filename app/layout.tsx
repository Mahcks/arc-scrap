import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARC Scrap - Loot Helper",
  description:
    "Interactive companion tool for ARC Raiders looting, recycling, and workshop upgrades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {/* Minimal Header */}
        <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold gradient-text">ARC Scrap</h1>
              <div className="text-xs text-[var(--text-muted)] hidden sm:block">
                Loot & Recycling Guide
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">{children}</main>

        {/* Minimal Footer */}
        <footer className="border-t border-[var(--border)] mt-16 py-6 bg-[var(--surface)]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <a
                  href="https://ko-fi.com/prodeed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-secondary)] transition-colors"
                >
                  Data by u/pRoDeeD
                </a>
                <span className="text-[var(--border)]">•</span>
                <a
                  href="https://ardb.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-secondary)] transition-colors"
                >
                  API by ardb.app
                </a>
              </div>
              <div className="text-[10px]">
                Not affiliated with Embark Studios
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
