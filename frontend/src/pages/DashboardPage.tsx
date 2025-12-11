import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const DashboardPage = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
      } else {
        // Redirect to home page after successful logout
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err)
    }
  }

  return (
    <div>
      <div>DashboardPage</div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

export default DashboardPage