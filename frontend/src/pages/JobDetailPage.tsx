import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock,
  Building2,
  CheckCircle2,
  Send
} from 'lucide-react'
import { jobsService, type Job } from '../services/jobsService'

const JobDetailPage = () => {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>()
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!slug || !jobId) return

      try {
        setLoading(true)
        const data = await jobsService.getJobById(slug, parseInt(jobId))
        setJob(data)
      } catch (err) {
        console.error("Failed to fetch job", err)
        setError('Could not load job details.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetail()
  }, [slug, jobId])

  const handleApply = () => {
    setIsApplied(true)
  }

  const formatSalary = (job: Job) => {
    if (!job.min_salary && !job.max_salary) return 'Salary not specified'
    return `${job.currency} ${job.min_salary?.toLocaleString() || 0} - ${job.max_salary?.toLocaleString() || 'Max'}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 mb-6 text-lg">{error || 'Job not found'}</p>
          {/* <Link 
            to={`/${slug}/manage-jobs`} 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link> */}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Link */}
      {/* <Link 
        to={`/${slug}/manage-jobs`} 
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Job List
      </Link> */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{job.job_type}</span>
                </div>
                
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span>{formatSalary(job)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`
                  w-full lg:w-auto px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-200
                  flex items-center justify-center gap-2
                  ${isApplied 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-default' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105'
                  }
                `}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Application Submitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-900">Job Description</h2>
          </div>
          
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
            {job.description}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Job ID: {job.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage