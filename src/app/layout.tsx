import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Providers from '../providers/ReactQueryProvider'
import { WorkspaceProvider } from '@/lib/context/workspace-context'

// Font setup
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lynk App',
  description: 'Link management platform',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-inter antialiased">
        <Providers>
          <WorkspaceProvider>
            {/* Provide workspace context */}
            {children}
          </WorkspaceProvider>
        </Providers>
      </body>
    </html>
  )
}
