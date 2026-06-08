import type { Metadata } from 'next'
import './globals.css'
import { PortalShell } from '@/components/layout/PortalShell'

export const metadata: Metadata = {
  title: 'Corporate Portal',
  description: '公司内部信息发布与工具导航平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      {/* eslint-disable @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;900&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* eslint-enable @next/next/no-page-custom-font */}
      <body className="bg-background text-on-surface min-h-screen antialiased">
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  )
}
