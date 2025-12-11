import { apiClient } from '../lib/apiClient'

// --- Types based on your Python Models ---

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship"
}

export interface Job {
  id: number
  title: string
  location: string
  description: string
  min_salary?: number
  max_salary?: number
  currency: string
  job_type: JobType
  is_active: boolean
  created_at: string
}

export interface JobCreate {
  title: string
  location: string
  description: string
  job_type: JobType
  min_salary?: number
  max_salary?: number
  currency: string
}

export type JobUpdate = Partial<JobCreate>

// --- Service ---

export const jobsService = {
  // GET /{company_slug}/jobs
  getJobs: async (slug: string): Promise<Job[]> => {
    const response = await apiClient.get(`/${slug}/jobs`)
    return response.data
  },

  // POST /{company_slug}/jobs
  createJob: async (slug: string, data: JobCreate): Promise<Job> => {
    const response = await apiClient.post(`/${slug}/jobs`, data)
    return response.data
  },

  // PATCH /{company_slug}/jobs/{job_id}
  updateJob: async (slug: string, jobId: number, data: JobUpdate): Promise<Job> => {
    const response = await apiClient.patch(`/${slug}/jobs/${jobId}`, data)
    return response.data
  },

  // DELETE /{company_slug}/jobs/{job_id}
  deleteJob: async (slug: string, jobId: number): Promise<void> => {
    await apiClient.delete(`/${slug}/jobs/${jobId}`)
  },

  // PATCH /{company_slug}/jobs/{job_id}/toggle?is_active={bool}
  toggleJobStatus: async (slug: string, jobId: number, isActive: boolean): Promise<Job> => {
    // Note: Passing boolean as query param as defined in your FastAPI endpoint
    const response = await apiClient.patch(`/${slug}/jobs/${jobId}/toggle`, null, {
      params: { is_active: isActive }
    })
    return response.data
  }
}