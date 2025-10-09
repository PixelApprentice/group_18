import './globals.css'
import { GeistSans, GeistMono } from 'geist/font'
import { ThemeProvider } from 'next-themes'
import Header from '../components/header'
import Footer from '../components/footer'

export const metadata = {
  title: 'SEKUR Labs',
  description: 'Interactive cybersecurity labs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
