import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import Header from './components/Header';


export const metadata: Metadata = {
  title: 'PDF Chat',
  description: 'Chat with your PDFs using AI!',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="en">
        {/* Main Background Gradient */}
        <body className="h-screen min-w-screen bg-gradient-to-br from-[#0B2A1C] to-[#04150E] relative py-4">
        {/* Subtle Layered Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tl from-[#0D3721]/80 via-[#0B2A1C]/70 to-transparent mix-blend-overlay"></div>
          {/* Circular Accent */}
        <div className="absolute right-0 bottom-0 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-green-500/20 to-green-800/50 blur-3xl"></div>

        {/* wrapper for the main content */}
        <div className="relative z-10 flex flex-col h-full">
          <Header />
          {children}
          <Analytics />

        </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
         
       

       