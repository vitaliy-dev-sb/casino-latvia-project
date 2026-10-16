import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NativeBrowserMask from './native-browser-mask';
import AIChatWidget from '@/components/ui/ai-chat-widget';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seo-casino.bolt.host'),
  title: 'SEO Casino Latvia | Top Regulated Online Casinos',
  description: 'Discover the ultimate catalog of regulated online gambling, honest expert reviews, and exclusive casino bonuses in Latvia.',
  applicationName: 'SEO Casino Latvia',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: 'SEO Casino Latvia | Top Regulated Online Casinos',
    description: 'Discover the ultimate catalog of regulated online gambling, honest expert reviews, and exclusive casino bonuses in Latvia.',
    url: 'https://seo-casino.bolt.host',
    siteName: 'SEO Casino Latvia',
    locale: 'lv_LV',
    type: 'website',
    images: [
      {
        url: 'https://seo-casino.bolt.host/og-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'SEO Casino Latvia Official Social Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Casino Latvia | Top Regulated Online Casinos',
    description: 'Discover the ultimate catalog of regulated online gambling, honest expert reviews, and exclusive casino bonuses in Latvia.',
    images: ['https://seo-casino.bolt.host/og-image-v2.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body>
        <NativeBrowserMask />
        <div className="app-shell">{children}</div>
        <AIChatWidget />
      </body>
    </html>
  );
}
