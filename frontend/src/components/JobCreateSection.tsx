import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  
  // This number increments every time we create a job, forcing JobList to refresh
  const [refreshKey, setRefreshKey] = useState(0)

  // --- Handle Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug) return alert("Company ID is missing")
    
    setSubmitting(true)
    try {
      // Simple number conversion
      const payload = {
        ...formData,
        min_salary: Number(formData.min_salary) || 0,
        max_salary: Number(formData.max_salary) || 0,
      }

      await jobsService.createJob(slug, payload)
      
      // SUCCESS LOGIC:
      // 1. Clear form
      setFormData(INITIAL_FORM)
      // 2. Refresh the list (by changing the key)
      setRefreshKey(prev => prev + 1)
      // 3. Switch back to view tab
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
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-3 font-medium ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          View Jobs
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-medium ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Create Job
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === 'view' ? (
          // key={refreshKey} is the MAGIC. 
          // When refreshKey changes, React deletes the old component and mounts a new one.
          // This forces the useEffect inside JobList to run again and fetch new data.
          <JobList key={refreshKey} />
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Location</label>
                  <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select name="job_type" value={formData.job_type} onChange={handleInputChange} className="w-full border p-2 rounded bg-white">
                    {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Min Salary</label>
                  <input type="number" name="min_salary" value={formData.min_salary} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Max Salary</label>
                  <input type="number" name="max_salary" value={formData.max_salary} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea required name="description" rows={5} value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Job'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCreateSection