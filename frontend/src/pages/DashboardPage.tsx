import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { companyService, type Company } from '../services/companyService'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err)
    }
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        // The service handles the API call and token injection
        const data = await companyService.getRecruiterCompanies()
        setCompanies(data || [])
      } catch (err: any) {
        // Axios errors usually store the message in err.response.data or err.message
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch companies'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Companies</h1>
        <div>
          <button
            onClick={() => navigate('/page-builder')}
            className="mr-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Page Builder
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div>Loading companies...</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        {!loading && !error && companies.length === 0 && (
          <div>No companies yet. Create one in Page Builder.</div>
        )}

        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <li
              key={c.id}
              className="cursor-pointer border rounded-md p-4 hover:shadow-md flex items-center"
              onClick={() => navigate(`/page-builder/${c.slug}`)}
            >
              {c.branding_config?.logo_url ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img 
                  src={c.branding_config?.logo_url} 
                  alt={`${c.company_name} logo`} 
                  className="w-12 h-12 mr-4 object-contain" 
                />
              ) : (
                <div className="w-12 h-12 mr-4 bg-gray-200 flex items-center justify-center rounded">
                  🏢
                </div>
              )}
              <div>
                <div className="font-medium">{c.company_name}</div>
                <div className="text-sm text-gray-500">/{c.slug}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DashboardPage