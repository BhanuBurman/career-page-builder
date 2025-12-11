import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobsService, type Job } from '../services/jobsService'

const JobList = () => {
  const { slug } = useParams<{ slug: string }>()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      // Safety check: if no slug, stop here
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const data = await jobsService.getJobs(slug)
        // SIMPLIFIED: No filtering. Show everything the API returns.
        setJobs(data)
      } catch (err) {
        console.error("Failed to load jobs", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [slug])

  // Simple salary formatter
  const formatSalary = (job: Job) => {
    if (!job.min_salary && !job.max_salary) return null
    return `${job.currency} ${job.min_salary || 0} - ${job.max_salary || 'Max'}`
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>

  return (
    <div className="max-w-4xl mx-auto py-8">
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500">No jobs found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <div className="text-sm text-gray-600 mt-1 space-x-4">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.job_type}</span>
                  {formatSalary(job) && <span className="text-green-700">💰 {formatSalary(job)}</span>}
                </div>
              </div>

              <Link
                to={`/companies/${slug}/jobs/${job.id}`}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JobList