import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Source_Serif_4 } from 'next/font/google'
import './globals.css'
import './animations.css'
import './article-content.css'
import './article-print.css'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import PWARegister from '../components/PWARegister'
import ArticleLinkPreview from '../components/ArticleLinkPreview'
import PageTransition from '../components/PageTransition'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
})

const BASE_URL = 'https://soara.fr'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A1A1A',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Soara, voir autrement',
    template: '%s · Soara',
  },
  description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture. Des lectures de fond pour comprendre ce qui se passe vraiment.',
  keywords: ['géopolitique', 'économie', 'technologie', 'analyse', 'média indépendant'],
  authors: [{ name: 'Steve Moradel' }],
  creator: 'Soara',
  publisher: 'Soara',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Soara',
    title: 'Soara, voir autrement',
    description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Soara, voir autrement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soara, voir autrement',
    description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture.',
    images: ['/og-default.jpg'],
    creator: '@soaradotmedia',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Soara',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

// Splash screens iOS, mappes par device class (DPR + dimensions CSS).
// Apple selectionne le splash dont la media query matche exactement.
const APPLE_SPLASH = [
  { media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/splash/splash-iphone-15-pro-max-1290x2796.png' },
  { media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/splash/splash-iphone-14-plus-1284x2778.png' },
  { media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/splash/splash-iphone-15-pro-1179x2556.png' },
  { media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/splash/splash-iphone-14-1170x2532.png' },
  { media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/splash/splash-iphone-se-750x1334.png' },
  { media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/splash/splash-ipad-pro-12_9-2048x2732.png' },
  { media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/splash/splash-ipad-pro-11-1668x2388.png' },
  { media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/splash/splash-ipad-air-1640x2360.png' },
  { media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/splash/splash-ipad-1536x2048.png' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={sourceSerif.variable}>
      <head>
        {APPLE_SPLASH.map(s => (
          <link key={s.href} rel="apple-touch-startup-image" media={s.media} href={s.href} />
        ))}
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          src="https://plausible.io/js/pa-ensWIP0S1kx_PjlC_A8az.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
        <div className="no-print"><Footer /></div>
        <div className="no-print"><BottomNav /></div>
        <PWARegister />
        <ArticleLinkPreview />
      </body>
    </html>
  )
}
