import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Settings,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  LogOut,
  BarChart3,
  Package
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  { icon: FileText, label: 'Content', path: '/admin/content' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useAuth()

  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', color: 'bg-blue-500', icon: Users },
    { label: 'Total Orders', value: '3,847', change: '+8%', color: 'bg-green-500', icon: ShoppingCart },
    { label: 'Revenue', value: '$48,290', change: '+23%', color: 'bg-purple-500', icon: DollarSign },
    { label: 'Active Products', value: '156', change: '+5%', color: 'bg-orange-500', icon: Package },
  ]

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$29.99', status: 'completed', date: '2 hours ago' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$49.99', status: 'pending', date: '4 hours ago' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$19.99', status: 'processing', date: '6 hours ago' },
    { id: '#ORD-004', customer: 'Sarah Williams', amount: '$59.99', status: 'completed', date: '1 day ago' },
  ]

  const recentUsers = [
    { name: 'Alice Brown', email: 'alice@example.com', joined: '2 hours ago', status: 'active' },
    { name: 'Bob Davis', email: 'bob@example.com', joined: '5 hours ago', status: 'active' },
    { name: 'Charlie Wilson', email: 'charlie@example.com', joined: '1 day ago', status: 'pending' },
    { name: 'Diana Miller', email: 'diana@example.com', joined: '2 days ago', status: 'active' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'processing':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return CheckCircle
      case 'pending':
        return AlertCircle
      case 'processing':
        return TrendingUp
      default:
        return XCircle
    }
  }

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
                    key={item.path}
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
                  <div className="text-sm font-semibold mb-2">Admin Panel</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Full access to all features
                  </p>
                  <Button size="sm" className="w-full" variant="outline">
                    View Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} mt-20`}>
          <div className="p-4 md:p-6 pt-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Overview of your platform</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="success">Admin</Badge>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                          <p className="text-xs text-green-500 mt-1">{stat.change}</p>
                        </div>
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                </CardHeader>
                <CardContent>
                  <div className="h-48 md:h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">User Growth</h3>
                </CardHeader>
                <CardContent>
                  <div className="h-48 md:h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">User Growth Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  <Link to="/admin/orders">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status)
                        return (
                          <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                            <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                            <td className="py-3 px-4 text-sm">{order.customer}</td>
                            <td className="py-3 px-4 text-sm font-medium">{order.amount}</td>
                            <td className="py-3 px-4">
                              <Badge variant={getStatusColor(order.status) as any} className="flex items-center w-fit">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Users</h3>
                  <Link to="/admin/users">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(user.status) as any}>{user.status}</Badge>
                        <span className="text-sm text-gray-500 hidden sm:block">{user.joined}</span>
                      </div>
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
