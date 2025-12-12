import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
  List, 
  PlusCircle, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { jobsService, type JobCreate, JobType } from '../services/jobsService'
import JobList from './JobList'

const INITIAL_FORM: JobCreate = {
  title: '',
  location: '',
  description: '',
  job_type: JobType.FULL_TIME,
  min_salary: 0,
  max_salary: 0,
  currency: 'USD'
}

const JobCreateSection = () => {
  const { slug } = useParams<{ slug: string }>()
  
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view')
  const [formData, setFormData] = useState<JobCreate>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [descriptionError, setDescriptionError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug) return alert("Company ID is missing")
    
    if ((formData.description || '').trim().length < 10) {
      setDescriptionError('Description must be at least 10 characters.')
      return
    }
    setDescriptionError('')

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        min_salary: Number(formData.min_salary) || 0,
        max_salary: Number(formData.max_salary) || 0,
      }

      await jobsService.createJob(slug, payload)
      
      setFormData(INITIAL_FORM)
      setRefreshKey(prev => prev + 1)
      setActiveTab('view')
      
    } catch (error) {
      console.error("Error creating job", error)
      alert("Failed to create job.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'description') {
      if ((value || '').trim().length >= 10) setDescriptionError('')
    }
  }

  const isDescriptionValid = (formData.description || '').trim().length >= 10

  return (
    <div className="max-w-6xl mx-auto">
      {/* TABS */}
      <div className="flex border-b border-gray-300 mb-6 bg-white rounded-t-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setActiveTab('view')}
          className={`
            flex items-center gap-2 px-6 py-4 font-medium transition-all
            ${activeTab === 'view' 
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <List className="w-5 h-5" />
          View Jobs
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`
            flex items-center gap-2 px-6 py-4 font-medium transition-all
            ${activeTab === 'create' 
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <PlusCircle className="w-5 h-5" />
          Create Job
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === 'view' ? (
          <JobList key={refreshKey} />
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Job</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title and Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Job Title
                  </label>
                  <input 
                    placeholder="e.g., Senior React Developer" 
                    required 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Location
                  </label>
                  <input 
                    placeholder="e.g., Remote, New York, Hybrid" 
                    required 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Type and Salary Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Job Type
                  </label>
                  <select 
                    name="job_type" 
                    value={formData.job_type} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    {Object.values(JobType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Min Salary
                  </label>
                  <input 
                    type="number" 
                    name="min_salary" 
                    value={formData.min_salary} 
                    onChange={handleInputChange} 
                    placeholder="0"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Max Salary
                  </label>
                  <input 
                    type="number" 
                    name="max_salary" 
                    value={formData.max_salary} 
                    onChange={handleInputChange} 
                    placeholder="0"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Job Description
                </label>
                <textarea 
                  placeholder="Provide a detailed job description (minimum 10 characters)..."
                  required 
                  name="description" 
                  rows={6} 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  {descriptionError ? (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{descriptionError}</span>
                    </div>
                  ) : isDescriptionValid ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Description looks good!</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {(formData.description || '').trim().length} / 10 characters minimum
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={submitting || !isDescriptionValid}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Job
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(INITIAL_FORM)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCreateSection