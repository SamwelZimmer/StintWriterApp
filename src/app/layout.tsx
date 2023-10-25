import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './Providers'

import RecoilRootWrapper from './RecoilRootWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stinter',
  description: 'Write in Stints',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRootWrapper>
          <Providers>
            {children}
          </Providers>
        </RecoilRootWrapper>
      </body>
    </html>
  )
}
