import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import CompanyRenderer, { type CompanyDataProps } from '../components/CompanyRenderer'

const CareerPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<CompanyDataProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await apiClient.get(`/api/companies/${slug}/careers`)
        
        // Transform API response to Renderer Props
        const apiData = res.data
        setData({
          company_name: apiData.company_name,
          branding: apiData.branding_config,
          content: apiData.page_content
        })
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchPublicData()
  }, [slug])

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (error || !data) return <div className="p-10 text-center text-red-500">Company not found.</div>

  return <CompanyRenderer data={data} />
}

export default CareerPage