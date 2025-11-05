'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/CustomToastProvider'

function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleGoogleCallback } = useAuth()
  const { success, error } = useToast()

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        handleGoogleCallback(token, userData)
        success('Google authentication successful!')
        router.push('/dashboard')
      } catch (err) {
        error('Failed to process authentication')
        router.push('/login')
      }
    } else {
      error('Authentication failed: Missing token or user data')
      router.push('/login')
    }
  }, [searchParams, handleGoogleCallback, success, error, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Processing authentication...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  )
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
}