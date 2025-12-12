import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Rocket, 
  Sparkles, 
  Building2, 
  Briefcase,
  Zap,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStartBuilding = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/auth')
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-20">
            <Sparkles className="w-24 h-24 text-blue-600 animate-pulse" />
          </div>
          <div className="absolute top-40 right-20 opacity-20">
            <Building2 className="w-32 h-32 text-purple-600 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-20">
            <Briefcase className="w-28 h-28 text-indigo-600 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg mb-8 animate-bounce">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Build Your Career Page in Minutes</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Career Page Builder
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create stunning, professional career pages for your company. 
              Showcase your brand, share your story, and attract top talent—all without writing a single line of code.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleStartBuilding}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Feature Pills */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Easy Customization</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Professional Templates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Job Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
          <div className="relative">

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-blue-500 text-white p-4 rounded-xl shadow-lg rotate-12 hidden md:block">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-purple-500 text-white p-4 rounded-xl shadow-lg -rotate-12 hidden md:block">
              <Briefcase className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage