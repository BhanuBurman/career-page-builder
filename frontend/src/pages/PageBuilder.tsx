import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyService, type AboutSubSection } from '../services/companyService'
import CompanyRenderer, { type CompanyDataProps } from '../components/CompanyRenderer'
import LiveLinkPopUp from '../components/LiveLinkPopUp'
import { Save, X, Plus, Trash2, Eye, ExternalLink, ArrowLeft, Palette, Type, Layout, Briefcase } from 'lucide-react'

const INITIAL_STATE = {
  company_name: '',
  primary_color: '#0f172a', 
  logo_url: '',
  header_title: 'We are building the future.',
  header_subtitle: 'Join our team and help us solve the hardest problems.',
  about_sections: [] as AboutSubSection[]
}

const PageBuilder = () => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(INITIAL_STATE)
  const [isLiveLinkOpened, setIsLiveLinkOpened] = useState(false)

  useEffect(() => {
    if (slug) {
      setLoading(true)
      companyService.getCompanyForEdit(slug)
        .then((data) => {
          setForm({
            company_name: data.company_name,
            primary_color: data.branding_config?.primary_color || INITIAL_STATE.primary_color,
            logo_url: data.branding_config?.logo_url || '',
            header_title: data.page_content?.header?.title || INITIAL_STATE.header_title,
            header_subtitle: data.page_content?.header?.subtitle || INITIAL_STATE.header_subtitle,
            about_sections: data.page_content?.about_sections || [],
          })
        })
        .finally(() => setLoading(false))
    }
  }, [slug])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleSectionChange = (index: number, field: keyof AboutSubSection, value: string) => {
    const updated = [...form.about_sections]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, about_sections: updated })
  }

  const addSection = () => {
    setForm({
      ...form,
      about_sections: [
        ...form.about_sections,
        { title: 'New Section', description: 'Description...', image_url: '', alignment: 'left' }
      ]
    })
  }

  const removeSection = (index: number) => {
    const updated = form.about_sections.filter((_, i) => i !== index)
    setForm({ ...form, about_sections: updated })
  }

  const handleSave = async () => {
    setSaving(true)
    
    const payload = {
      company_name: form.company_name,
      branding: {
        primary_color: form.primary_color,
        logo_url: form.logo_url,
      },
      page_content: {
        header: {
          title: form.header_title,
          subtitle: form.header_subtitle,
        },
        about_sections: form.about_sections,
      }
    }

    try {
      if (slug) {
        await companyService.updateCompany(slug, payload)
        setIsLiveLinkOpened(true)
      } else {
        const newCompany = await companyService.createCompany(payload)
        navigate(`/page-builder/${newCompany.slug}`)
        setIsLiveLinkOpened(true) 
      }
    } catch (err) {
      console.error("Save failed", err)
      alert("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const previewData: CompanyDataProps = {
    company_name: form.company_name,
    branding: { primary_color: form.primary_color, logo_url: form.logo_url },
    content: {
      header: { title: form.header_title, subtitle: form.header_subtitle },
      about_sections: form.about_sections
    }
  }

  const liveUrl = slug ? `${window.location.origin}/${slug}/careers` : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading your page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 relative">

      {isLiveLinkOpened && slug && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <LiveLinkPopUp 
            url={liveUrl} 
            onClose={() => setIsLiveLinkOpened(false)} 
          />
        </div>
      )}

      {/* EDITOR SIDEBAR */}
      <div className="w-full md:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full shadow-2xl z-20">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg">Page Editor</h2>
            </div>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {slug && (
              <button 
                onClick={() => setIsLiveLinkOpened(true)} 
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Branding Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-slate-600" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branding</label>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Company Name</label>
                <input 
                  type="text" 
                  name="company_name" 
                  value={form.company_name} 
                  onChange={handleTextChange} 
                  placeholder="Enter company name" 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  disabled={!!slug} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Primary Color</label>
                <div className="flex items-center gap-3 p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                  <input 
                    type="color" 
                    name="primary_color" 
                    value={form.primary_color} 
                    onChange={handleTextChange} 
                    className="h-10 w-16 cursor-pointer border-0 rounded" 
                  />
                  <span className="text-sm font-mono text-slate-700">{form.primary_color}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Logo URL</label>
                <input 
                  type="text" 
                  name="logo_url" 
                  value={form.logo_url} 
                  onChange={handleTextChange} 
                  placeholder="https://example.com/logo.png" 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
            </div>
          </section>
          
          <div className="border-t border-slate-200"></div>

          {/* Header Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-slate-600" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Header Content</label>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Main Title</label>
                <input 
                  type="text" 
                  name="header_title" 
                  value={form.header_title} 
                  onChange={handleTextChange} 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  placeholder="Main headline" 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subtitle</label>
                <textarea 
                  name="header_subtitle" 
                  value={form.header_subtitle} 
                  onChange={handleTextChange} 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                  rows={3} 
                  placeholder="Supporting text" 
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-200"></div>

          {/* Sections */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Layout className="w-4 h-4 text-slate-600" />
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Sections</label>
              </div>
              <button 
                onClick={addSection} 
                className="flex items-center space-x-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {form.about_sections.map((section, idx) => (
                <div key={idx} className="border border-slate-300 p-4 rounded-lg bg-gradient-to-br from-white to-slate-50 relative shadow-sm">
                  <button 
                    onClick={() => removeSection(idx)} 
                    className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-3 pr-8">
                    <select 
                      value={section.alignment} 
                      onChange={(e) => handleSectionChange(idx, 'alignment', e.target.value as any)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="left">Image Right, Text Left</option>
                      <option value="right">Image Left, Text Right</option>
                    </select>
                    
                    <input 
                      type="text" 
                      value={section.title} 
                      onChange={(e) => handleSectionChange(idx, 'title', e.target.value)} 
                      className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Section title" 
                    />
                    
                    <textarea 
                      value={section.description} 
                      onChange={(e) => handleSectionChange(idx, 'description', e.target.value)} 
                      className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                      placeholder="Section description" 
                      rows={3}
                    />
                    
                    <input 
                      type="text" 
                      value={section.image_url} 
                      onChange={(e) => handleSectionChange(idx, 'image_url', e.target.value)} 
                      className="w-full border border-slate-300 p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Image URL" 
                    />
                  </div>
                </div>
              ))}
              
              {form.about_sections.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No sections yet. Click "Add Section" to get started.
                </div>
              )}
            </div>
          </section>

          <div className="border-t border-slate-200"></div>

          {/* Manage Jobs */}
          {slug && (
            <section>
              <button 
                onClick={() => navigate(`/${slug}/manage-jobs`)}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                <Briefcase className="w-4 h-4" />
                <span>Manage Jobs</span>
              </button>
            </section>
          )}
        </div>

        {/* Publish Button */}
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-white to-slate-50">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="flex-1 bg-slate-100 overflow-y-auto">
        <div className="min-h-full p-4 md:p-8 flex justify-center items-start">
          <div className="w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-center space-x-2 text-slate-600">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Live Preview</span>
            </div>
            <div className="shadow-2xl rounded-xl overflow-hidden border-4 border-white bg-white">
              <CompanyRenderer data={previewData} isPreview={true} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PageBuilder