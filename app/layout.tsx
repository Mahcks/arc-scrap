import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARC Raiders - Loot Helper",
  description: "Interactive companion tool for ARC Raiders looting, recycling, and workshop upgrades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <nav className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold gradient-text">
                ARC Raiders Loot Helper
              </h1>
              <div className="text-sm text-gray-400">
                Interactive Cheat Sheet
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400 space-y-2">
            <p>
              Recycling data from{' '}
              <a href="https://ko-fi.com/prodeed" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                V3 Cheat Sheet by u/pRoDeeD
              </a>
            </p>
            <p>
              Item database provided by{' '}
              <a href="https://ardb.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                ardb.app
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Not affiliated with Embark Studios. All trademarks are property of their respective owners.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
