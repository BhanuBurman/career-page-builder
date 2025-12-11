import { apiClient } from '../lib/apiClient'

// --- Types ---

export type AboutSubSection = {
  title: string
  description: string
  image_url: string
  alignment: 'left' | 'right'
}

export type Company = {
  id: number
  company_name: string
  slug: string
  branding_config?: {
    primary_color?: string
    logo_url?: string
  }
  page_content?: {
    header?: {
      title: string
      subtitle: string
    }
    about_sections?: AboutSubSection[]
  }
}

// Request payloads
export type CompanyCreate = {
  company_name: string
  branding: {
    primary_color: string
    logo_url: string
  }
  page_content: {
    header: {
      title: string
      subtitle: string
    }
    about_sections: AboutSubSection[]
  }
}

export type CompanyUpdate = Partial<CompanyCreate>

// --- Service ---

export const companyService = {
  getRecruiterCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get('/api/companies/all')
    return response.data
  },

  getCompanyForEdit: async (slug: string): Promise<Company> => {
    const response = await apiClient.get(`/api/companies/${slug}/preview`)
    return response.data
  },

  createCompany: async (data: CompanyCreate): Promise<Company> => {
    const response = await apiClient.post('/api/companies', data)
    return response.data
  },

  updateCompany: async (slug: string, data: CompanyUpdate): Promise<Company> => {
    const response = await apiClient.patch(`/api/companies/${slug}/edit`, data)
    return response.data
  }
}