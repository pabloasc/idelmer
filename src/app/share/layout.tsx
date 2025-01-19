import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Share Your Idelmer Results',
  description: 'Share your Idelmer word game results with friends and compete for the highest score!',
  metadataBase: new URL('https://idelmer.com'),
  openGraph: {
    title: 'Idelmer Game Results',
    description: 'Check out my results from the Idelmer word game!',
    type: 'website',
    url: 'https://idelmer.com',
    siteName: 'Idelmer',
    images: [
      {
        url: '/logo.png', // Updated to be relative to metadataBase
        width: 800,
        height: 600,
        alt: 'Idelmer Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idelmer Game Results',
    description: 'Check out my results from the Idelmer word game!',
    site: '@idelmer', // Replace with your Twitter handle
    creator: '@idelmer', // Replace with your Twitter handle
    images: ['/logo.png'], // Updated to be relative to metadataBase
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://idelmer.com/share',
  },
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 