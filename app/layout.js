import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import CustomToastProvider from './components/CustomToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog App',
  description: 'A modern blog application with authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CustomToastProvider>
            {children}
          </CustomToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}