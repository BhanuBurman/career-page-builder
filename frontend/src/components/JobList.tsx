import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter,
  X,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { jobsService, type Job, JobType } from '../services/jobsService'

const JobList = () => {
  const { slug } = useParams<{ slug: string }>()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter state
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState<JobType | ''>('')

  useEffect(() => {
    const fetchJobs = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const data = await jobsService.getJobs(slug, {
          search: search || undefined,
          location: location || undefined,
          jobType: jobType ? (jobType as JobType) : undefined,
        })
        setJobs(data)
      } catch (err) {
        console.error("Failed to load jobs", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [slug, search, location, jobType])

  const formatSalary = (job: Job) => {
    if (!job.min_salary && !job.max_salary) return null
    return `${job.currency} ${job.min_salary?.toLocaleString() || 0} - ${job.max_salary?.toLocaleString() || 'Max'}`
  }

  const hasActiveFilters = search || location || jobType

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-4">
      {/* Filter & Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., React Developer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Remote, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType | '')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Types</option>
                <option value={JobType.FULL_TIME}>{JobType.FULL_TIME}</option>
                <option value={JobType.PART_TIME}>{JobType.PART_TIME}</option>
                <option value={JobType.CONTRACT}>{JobType.CONTRACT}</option>
                <option value={JobType.INTERNSHIP}>{JobType.INTERNSHIP}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch('')
              setLocation('')
              setJobType('')
            }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Job List */}
      <div className="border border-gray-300 rounded-lg h-[480px] overflow-auto bg-gray-50 p-5">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">No jobs found</p>
            {hasActiveFilters && (
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {job.job_type}
                      </span>
                      {formatSalary(job) && (
                        <span className="flex items-center gap-1.5 text-green-700 font-medium">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          {formatSalary(job)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/${slug}/jobs/${job.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList