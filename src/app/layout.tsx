"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import localFont from "next/font/local"
import { useState } from 'react'
import { Toaster } from 'sonner'
import "./globals.css"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
      <html lang="kk">
        <body
          className={`${proDisplay.variable} font-proDisplay antialiased h-screen`}
        >
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </QueryClientProvider>
  )
}