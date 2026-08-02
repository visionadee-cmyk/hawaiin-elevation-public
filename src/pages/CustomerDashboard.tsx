import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Download, 
  Bookmark, 
  Bell, 
  Receipt, 
  User, 
  CreditCard, 
  Heart, 
  MessageSquare, 
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Orders', path: '/order' },
  { icon: Download, label: 'Downloads', path: '/dashboard' },
  { icon: Bookmark, label: 'Saved Projects', path: '/dashboard' },
  { icon: Bell, label: 'Notifications', path: '/dashboard' },
  { icon: Receipt, label: 'Invoices', path: '/payment' },
  { icon: User, label: 'Profile', path: '/dashboard' },
  { icon: CreditCard, label: 'Subscription', path: '/payment' },
  { icon: Heart, label: 'Favorites', path: '/dashboard' },
  { icon: MessageSquare, label: 'Messages', path: '/chat' },
  { icon: Settings, label: 'Settings', path: '/dashboard' },
]

export function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const stats = [
    { label: 'Total Orders', value: '12', color: 'bg-blue-500' },
    { label: 'Downloads', value: '8', color: 'bg-green-500' },
    { label: 'Saved Projects', value: '5', color: 'bg-purple-500' },
    { label: 'Unread Messages', value: '3', color: 'bg-orange-500' },
  ]

  const recentActivity = [
    { action: 'Order completed', item: 'Professional CV', time: '2 hours ago' },
    { action: 'Project saved', item: 'Portfolio Website', time: '1 day ago' },
    { action: 'Invoice paid', item: '#INV-001', time: '3 days ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 md:static fixed left-0 top-16 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-300 overflow-hidden md:overflow-visible`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mb-4"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {sidebarOpen && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-semibold mb-2">Upgrade to Pro</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Unlock all features and templates
                  </p>
                  <Button size="sm" className="w-full">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} mt-20`}>
          <div className="p-6 pt-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your account</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="success">Free Plan</Badge>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold">{stat.value}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Link to="/cv-builder">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-semibold mb-2">Create CV</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Build a professional resume</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/cover-letter">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">✉️</div>
                    <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered cover letters</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/website-builder">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">🌐</div>
                    <h3 className="text-lg font-semibold mb-2">Website</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Build your portfolio</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.item}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
