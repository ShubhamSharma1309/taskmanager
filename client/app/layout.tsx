"use client";

import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/lib/redux/store";
import type { Metadata } from "next";
import { useTheme } from "next-themes";
import localFont from "next/font/local";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-stone-900  antialiased bg-background text-foreground min-h-screen w-full flex flex-col relative ${theme === "dark" ? "bg-black/[0.96] bg-grid-white/[0.02]" : "bg-white"}`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-grow">{children}</main>
              </div>
              <Toaster />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}