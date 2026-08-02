import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { 
  Bell, 
  X, 
  Check, 
  Trash2,
  Settings,
  Info,
  DollarSign,
  MessageSquare,
  ShoppingCart,
  Sparkles
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'order' | 'payment' | 'message' | 'system' | 'promotion'
  title: string
  body: string
  read: boolean
  createdAt: Date
  data?: any
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'payment' | 'message' | 'system'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" />
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />
      case 'promotion':
        return <Sparkles className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'payment':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'message':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'system':
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      case 'promotion':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-96 max-h-[500px] z-50 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                        <Check className="w-4 h-4 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={onClearAll}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear all
                    </Button>
                  </div>
                </div>
                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['all', 'unread', 'order', 'payment', 'message', 'system'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        filter === f
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[400px]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium text-gray-900 dark:text-white ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.body}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-xs"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
