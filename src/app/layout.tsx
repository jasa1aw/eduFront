"use client";

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const proDisplay = localFont({
  src: [
    {
      path: "./fonts/proDisplay/SFProDisplayLight.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplayRegular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplayMedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplaySemibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplayBold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplayHeavy.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/proDisplay/SFProDisplayBlack.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-prodisplay",
})

// export const metadata: Metadata = {
//   title: "TestiQ",
//   description: "Online testing platform",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 минута
        retry: 1,
      },
    },
  }))
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="ru">
        <body
          className={`${proDisplay.variable} font-proDisplay antialiased h-screen`}
        >
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}