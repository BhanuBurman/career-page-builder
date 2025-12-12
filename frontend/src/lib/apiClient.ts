import axios from 'axios'
import { supabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL

// 1. Helper to safely get the Supabase Access Token
// This handles v1/v2 compatibility as per your request
async function getSupabaseAccessToken(): Promise<string | null> {
  try {
    const authAny = (supabase.auth as any)
    
    // Check for Supabase v2 getSession
    if (typeof authAny.getSession === 'function') {
      const { data } = await authAny.getSession()
      return data?.session?.access_token ?? null
    }

    // Check for older Supabase versions
    if (typeof authAny.session === 'function') {
      const session = authAny.session()
      return session?.access_token ?? null
    }

    // Direct property access fallback
    return authAny.session?.access_token ?? null
  } catch (err) {
    console.warn('Error retrieving Supabase session token:', err)
    return null
  }
}

// 2. Create the Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 3. Request Interceptor
// Before sending ANY request, attach the Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getSupabaseAccessToken()
    console.log('Attaching token to request:', token) // remove in prod
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 4. Response Interceptor (Optional but recommended)
// Handle global 401 (Unauthorized) errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! You might want to redirect to login here.')
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error)
  }
)