import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "AI Personal Blog",
  description: "A personal blog built with Next.js, Tailwind CSS, Supabase, and AI-assisted content creation.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-128px)] max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
