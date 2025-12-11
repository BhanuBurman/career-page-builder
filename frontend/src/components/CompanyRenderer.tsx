import React from 'react'
import JobList from './JobList'

// Define the shape of data this component expects
export type CompanyDataProps = {
  company_name: string
  branding: {
    primary_color: string
    logo_url?: string
  }
  content: {
    header: {
      title: string
      subtitle: string
    }
    about_sections: Array<{
      title: string
      description: string
      image_url?: string
      alignment: 'left' | 'right'
    }>
  }
}

const CompanyRenderer: React.FC<{ data: CompanyDataProps; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const { branding, content, company_name } = data
  const primaryColor = branding.primary_color || '#000'

  return (
    <div className={`min-h-screen bg-white font-sans text-gray-900 ${isPreview ? 'pointer-events-none' : ''}`}>
      
      {/* 1. Header Section */}
      <header className="py-20 px-6 text-center text-white transition-colors duration-300" style={{ backgroundColor: primaryColor }}>
        {branding.logo_url && (
          <img 
            src={branding.logo_url} 
            alt="Logo" 
            className="h-20 mx-auto mb-6 object-contain bg-white/10 p-2 rounded" 
          />
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          {content.header.title || 'Welcome'}
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          {content.header.subtitle}
        </p>
      </header>

      {/* 2. About Sections (Zig-Zag) */}
      <main>
        {(content.about_sections || []).map((section, idx) => (
          <div 
            key={idx} 
            className={`py-20 px-6 md:px-20 flex flex-col md:flex-row gap-12 items-center 
              ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            {/* Text Block */}
            <div className={`flex-1 ${section.alignment === 'right' ? 'md:order-2' : 'md:order-1'}`}>
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {section.description}
              </p>
            </div>

            {/* Image Block */}
            <div className={`flex-1 ${section.alignment === 'right' ? 'md:order-1' : 'md:order-2'}`}>
              {section.image_url ? (
                <img 
                  src={section.image_url} 
                  alt={section.title} 
                  className="rounded-xl shadow-xl w-full h-auto object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State for Preview */}
        {content.about_sections.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic bg-gray-50">
            {isPreview ? 'Add "About Sections" to see them appear here.' : ''}
          </div>
        )}
      </main>

      {/* 3. Job Board Placeholder */}
      <div id="jobs" className="py-20 px-6 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">
              {isPreview ? 'Jobs from your dashboard will appear here.' : <JobList />}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white text-center py-6 text-xs opacity-80">
        &copy; {new Date().getFullYear()} {company_name}
      </div>

    </div>
  )
}

export default CompanyRenderer