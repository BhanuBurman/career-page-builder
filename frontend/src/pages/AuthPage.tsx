import { useState } from 'react'
import Login from '../components/Login'
import { supabase } from '../supabaseClient'

interface ApiResponse {
  user_id: string
  email: string
  message: string
}

const AuthPage = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Example: Call protected FastAPI endpoint
  const callProtectedAPI = async () => {
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setApiError('Not authenticated')
        return
      }

      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to fetch')
      }

      const data = await response.json()
      setApiData(data)
      setApiError(null)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred')
      setApiData(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Career Page Builder
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <Login />
          <hr className="my-8 border-gray-300" />
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Test Protected API
            </h3>
            <button
              onClick={callProtectedAPI}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Call /api/auth/me
            </button>
            {apiData && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}
            {apiError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">Error: {apiError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage