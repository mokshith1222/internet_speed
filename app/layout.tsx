import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SchemaMarkup } from '@/components/schema-markup'

export const metadata: Metadata = {
  title: 'SpeedTest - Fast & Accurate Internet Speed Checker | Test Your Connection Now',
  description: 'Test your internet speed instantly with SpeedTest. Get accurate download, upload speeds, ping, and jitter measurements. Free, no login required, 100% private. Check your broadband connection quality now.',
  generator: 'v0.app',
  keywords: 'internet speed test, speed checker, bandwidth test, connection test, download speed test, upload speed test, ping test, latency test, jitter test, internet speed, broadband speed, WiFi speed, connection quality, fiber speed test, cable speed test, DSL speed test',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  authors: [{ name: 'SpeedTest Team' }],
  creator: 'SpeedTest',
  publisher: 'SpeedTest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'SpeedTest - Fast & Accurate Internet Speed Checker',
    description: 'Test your internet speed instantly with SpeedTest. Get accurate download, upload speeds, ping, and jitter measurements. Free and 100% private.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SpeedTest',
    url: 'https://veloci-pi.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpeedTest - Fast Internet Speed Checker',
    description: 'Test your internet speed and connection quality instantly. Free, accurate, and private.',
    creator: '@speedtest',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://veloci-pi.vercel.app',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense - Replace YOUR_ADSENSE_ID with your actual AdSense ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Search Console */}
        <meta name="google-site-verification" content="googlefbfa23743896d7f7" />
      </head>
      <body className="antialiased bg-background text-foreground">
        <SchemaMarkup />
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
