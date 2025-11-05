'use client'
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Authentication failed'

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Home
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected to the login page in 5 seconds...
        </p>
      </div>
    </div>
  )
}