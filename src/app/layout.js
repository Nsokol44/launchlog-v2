import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://launchlog-v2.vercel.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LaunchLog — Discover What's Next",
    template: '%s | LaunchLog',
  },
  description: 'Swipe through early-stage startups solving real problems. Support the ones you love, leave feedback on the rest.',
  keywords: ['startups', 'startup discovery', 'early stage', 'founders', 'product discovery'],
  openGraph: {
    type: 'website',
    siteName: 'LaunchLog',
    title: "LaunchLog — Discover What's Next",
    description: 'Swipe through early-stage startups solving real problems.',
    images: [{
      url: `${siteUrl}/api/og?name=LaunchLog&tagline=Discover%20what%27s%20next&emoji=%F0%9F%9A%80&supporters=0&category=`,
      width: 1200,
      height: 630,
      alt: 'LaunchLog — Discover What\'s Next',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "LaunchLog — Discover What's Next",
    description: 'Swipe through early-stage startups solving real problems.',
    images: [`${siteUrl}/api/og?name=LaunchLog&tagline=Discover%20what%27s%20next&emoji=%F0%9F%9A%80&supporters=0&category=`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cream text-ink font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#2d2420',
                color: '#fff',
                borderRadius: '99px',
                padding: '12px 20px',
                fontSize: '0.88rem',
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}