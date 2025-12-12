import React from 'react'
import { 
  Building2, 
  Sparkles, 
  Briefcase, 
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react'
import JobList from './JobList'

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
      
      {/* Header Section */}
      <header className="relative py-24 px-6 text-center text-white transition-colors duration-300 overflow-hidden" style={{ backgroundColor: primaryColor }}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Building2 className="w-20 h-20" />
          </div>
        </div>

        <div className="relative z-10">
          {branding.logo_url && (
            <div className="mb-8 flex justify-center">
              <img 
                src={branding.logo_url} 
                alt="Company Logo" 
                className="h-24 object-contain bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg" 
              />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            {content.header.title || 'Welcome'}
          </h1>
          <p className="text-lg md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed font-light">
            {content.header.subtitle}
          </p>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto opacity-75" />
          </div>
        </div>
      </header>

      {/* About Sections */}
      <main>
        {(content.about_sections || []).map((section, idx) => (
          <div 
            key={idx} 
            className={`py-20 px-6 md:px-20 flex flex-col md:flex-row gap-12 items-center transition-all
              ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            {/* Text Block */}
            <div className={`flex-1 ${section.alignment === 'right' ? 'md:order-2' : 'md:order-1'}`}>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">{section.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {section.description}
              </p>
            </div>

            {/* Image Block */}
            <div className={`flex-1 ${section.alignment === 'right' ? 'md:order-1' : 'md:order-2'}`}>
              {section.image_url ? (
                <div className="relative group">
                  <img 
                    src={section.image_url} 
                    alt={section.title} 
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-80 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                  <ImageIcon className="w-16 h-16 mb-3 opacity-40" />
                  <span className="text-sm font-medium">No Image Available</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {content.about_sections.length === 0 && isPreview && (
          <div className="py-32 text-center bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gray-200 rounded-full">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-400 text-lg italic">
                Add "About Sections" to showcase your company story
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Job Board Section */}
      <div id="jobs" className="py-24 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Careers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Open Positions</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join our team and help us build something amazing
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {isPreview ? (
              <div className="p-16 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Briefcase className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-500 text-lg">
                  Jobs from your dashboard will appear here
                </p>
              </div>
            ) : (
              <div className="p-8">
                <JobList />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8 border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="w-5 h-5 opacity-70" />
          <span className="text-sm opacity-90 font-medium">{company_name}</span>
        </div>
        <p className="text-xs opacity-60">
          &copy; {new Date().getFullYear()} All rights reserved
        </p>
      </footer>
    </div>
  )
}

export default CompanyRenderer