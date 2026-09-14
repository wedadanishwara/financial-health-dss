import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Financial Health DSS</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.fullName}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-6">Welcome to Financial Health Decision Support System!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-900 mb-2">Financial Well-Being</h3>
              <p className="text-gray-600 text-sm">Assess your financial health</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-900 mb-2">Overconfidence Bias</h3>
              <p className="text-gray-600 text-sm">Detect overconfidence patterns</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-900 mb-2">Financial Impulsivity</h3>
              <p className="text-gray-600 text-sm">Analyze impulsive spending</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-900 mb-2">Loss Aversion</h3>
              <p className="text-gray-600 text-sm">Understand risk perception</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
