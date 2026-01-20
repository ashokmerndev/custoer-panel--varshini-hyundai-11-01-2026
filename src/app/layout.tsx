// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Orbitron } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { Footer } from '@/components/Footer';
import ReviewsCarousel from '@/components/ReviewsCarousel';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hyundai Spares | Premium Genuine Parts',
  description: 'Discover premium genuine spare parts for your Hyundai vehicle. Quality assured. Performance guaranteed.',
  keywords: 'Hyundai, spare parts, genuine parts, automotive, car parts, Creta, Verna, i20',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-body`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-[#050B14] text-white antialiased">
            <Navbar />
            <main className="flex-1">{children}</main>
            <ReviewsCarousel />
            <Footer />
          </div>
          <CartDrawer />
          <WhatsAppWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#00AAD2',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
