import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyService, type AboutSubSection } from '../services/companyService'
import CompanyRenderer, { type CompanyDataProps } from '../components/CompanyRenderer'
import LiveLinkPopUp from '../components/LiveLinkPopUp'

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
  
  // Unified state: This controls the popup for BOTH "Save Success" and "Manual Click"
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
      content: {
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
        // Simply open the popup on success
        setIsLiveLinkOpened(true)
      } else {
        const newCompany = await companyService.createCompany(payload)
        navigate(`/page-builder/${newCompany.slug}`)
        // The navigate might cause a re-render, but setting this true 
        // ensures the popup opens once the new slug is active.
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

  // Determine the Live URL based on the current slug
  const liveUrl = slug ? `${window.location.origin}/${slug}/careers` : '';

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-gray-50 relative">

        {/* --- REUSABLE LIVE LINK POPUP --- */}
        {/* We reuse this for both "Save Success" and manual "Live Link" clicks */}
        {isLiveLinkOpened && slug && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <LiveLinkPopUp 
                  url={liveUrl} 
                  onClose={() => setIsLiveLinkOpened(false)} 
                />
            </div>
        )}

      {/* --- EDITOR SIDEBAR (Left) --- */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-20">
         {/* ... Your Sidebar Content ... */}
         
         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-gray-800">Page Editor</h2>
            <div className="flex items-center gap-4">
              {/* Only show "Live link" button if a slug exists (page is saved at least once) */}
              {slug && (
                 <button 
                   onClick={() => setIsLiveLinkOpened(true)} 
                   className="text-sm text-blue-600 hover:underline font-medium"
                 >
                   Live link
                 </button>
              )}
              <button onClick={() => navigate('/dashboard')} className="text-sm">Exit</button>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ... Inputs for Name, Color, Header, Sections (Identical to before) ... */}
            
            <section className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Branding</label>
              <input type="text" name="company_name" value={form.company_name} onChange={handleTextChange} placeholder="Company Name" className="w-full border p-2 rounded" disabled={!!slug} />
              <div className="flex items-center gap-2">
                 <input type="color" name="primary_color" value={form.primary_color} onChange={handleTextChange} className="h-8 w-8 cursor-pointer border-0 rounded" />
                 <span className="text-xs">{form.primary_color}</span>
              </div>
              <input type="text" name="logo_url" value={form.logo_url} onChange={handleTextChange} placeholder="Logo URL" className="w-full border p-2 rounded" />
            </section>
            
            <hr />

            <section className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Header</label>
              <input type="text" name="header_title" value={form.header_title} onChange={handleTextChange} className="w-full border p-2 rounded" placeholder="Main Title" />
              <textarea name="header_subtitle" value={form.header_subtitle} onChange={handleTextChange} className="w-full border p-2 rounded" rows={2} placeholder="Subtitle" />
            </section>

            <hr />

            <section className="space-y-3">
               <div className="flex justify-between">
                 <label className="text-xs font-bold text-gray-400 uppercase">Sections</label>
                 <button onClick={addSection} className="text-xs border px-2 py-1 rounded">+ Add</button>
               </div>
               {form.about_sections.map((section, idx) => (
                  <div key={idx} className="border p-2 rounded bg-gray-50 relative">
                      <button onClick={() => removeSection(idx)} className="absolute top-1 right-2 text-red-500">×</button>
                      <select 
                        value={section.alignment} 
                        onChange={(e) => handleSectionChange(idx, 'alignment', e.target.value as any)}
                        className="mb-2 text-xs border rounded p-1"
                      >
                        <option value="left">Text Left</option>
                        <option value="right">Text Right</option>
                      </select>
                      <input type="text" value={section.title} onChange={(e) => handleSectionChange(idx, 'title', e.target.value)} className="w-full mb-2 border p-1 rounded text-sm" placeholder="Title" />
                      <textarea value={section.description} onChange={(e) => handleSectionChange(idx, 'description', e.target.value)} className="w-full mb-2 border p-1 rounded text-sm" placeholder="Desc" />
                      <input type="text" value={section.image_url} onChange={(e) => handleSectionChange(idx, 'image_url', e.target.value)} className="w-full border p-1 rounded text-xs" placeholder="Image URL" />
                  </div>
               ))}
            </section>

            <hr />

            <section>
                <button onClick={() => navigate("/manage-jobs")}>Manage Jobs</button>
            </section>
         </div>

         <div className="p-4 border-t bg-white">
            <button onClick={handleSave} disabled={saving} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
               {saving ? 'Saving...' : 'Publish Changes'}
            </button>
         </div>
      </div>

      {/* --- LIVE PREVIEW AREA (Right) --- */}
      <div className="w-full md:w-2/3 bg-gray-200 overflow-y-auto">
        <div className="min-h-full p-4 md:p-8 flex justify-center items-start">
           <div className="w-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border bg-white">
              <CompanyRenderer data={previewData} isPreview={true} />
           </div>
        </div>
      </div>

    </div>
  )
}

export default PageBuilder