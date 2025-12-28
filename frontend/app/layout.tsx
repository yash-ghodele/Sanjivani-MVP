import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { NotificationProvider } from "@/context/NotificationContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-900 text-white font-sans selection:bg-nature-500/30 selection:text-nature-200" suppressHydrationWarning>
        <NotificationProvider>
          <ServiceWorkerRegister />
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
