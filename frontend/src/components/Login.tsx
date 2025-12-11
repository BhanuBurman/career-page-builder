import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// Type definition for User from Supabase session
type User = NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>['user']

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        
        setUser(session.user)
        // Redirect to dashboard if already logged in
        navigate('/dashboard', { replace: true })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('JWT access_token:', session.access_token) // remove in prod
        setUser(session.user)
        // Redirect to dashboard after successful login
        navigate('/dashboard', { replace: true })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  // Handle Manual Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
      // Navigation will happen via onAuthStateChange listener if successful
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setError(null)
        // Show success message
        alert('Sign up successful! Please check your email to verify your account, or try logging in if email confirmation is not required.')
        setIsSignUp(false)
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  // Handle OAuth (Google) Login
  const handleOAuth = async (provider: 'google') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      })

      if (error) {
        // Check if it's the "provider not enabled" error
        if (error.message.includes('provider is not enabled') || error.message.includes('Unsupported provider')) {
          setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not enabled. Please use email/password login or contact your administrator.`)
        } else {
          setError(error.message)
        }
        setLoading(false)
      }
      // OAuth will redirect to the provider, then back to /auth
      // The onAuthStateChange listener will handle navigation to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    // Redirect to home page after sign out
    navigate('/', { replace: true })
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome!</h2>
        <p className="text-gray-600 mb-4">Email: {user.email}</p>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isSignUp ? 'Sign Up' : 'Login'}
      </h2>

      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Form for Email/Password Login or Sign Up */}
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 mb-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null) // Clear error when user types
          }}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null) // Clear error when user types
          }}
          required
          minLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log in with Email'}
        </button>
      </form>

      {/* Toggle between Login and Sign Up */}
      <div className="text-center mb-6">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>

      <hr className="my-6 border-gray-300" />
      <p className="text-center text-gray-600 mb-4">Or continue with</p>

      {/* Button for Google OAuth */}
      <div>
        <button
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
        >
          Log in with Google
        </button>
      </div>
    </div>
  )
}



