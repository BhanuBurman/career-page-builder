import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password, 
            options: { emailRedirectTo: `${window.location.origin}/` } 
          })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error
      
      if (isSignUp) alert('Check your email for the verification link!')
      // If login is successful, AuthContext detects it -> triggers useEffect -> redirects to /dashboard
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 text-sm hover:underline">
            {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
          </button>
          <div className="border-t pt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}