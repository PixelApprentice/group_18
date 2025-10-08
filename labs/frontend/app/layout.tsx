import './globals.css'
import Header from '../components/header'
import Footer from '../components/footer'

export const metadata = {
  title: 'SEKUR Labs',
  description: 'Interactive cybersecurity labs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
