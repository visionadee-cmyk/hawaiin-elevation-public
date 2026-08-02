import { useState, useEffect, useRef } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Send, 
  MessageSquare, 
  Users, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  attachment?: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  lastMessage: string
  unread: number
}

const contacts: Contact[] = [
  { id: '1', name: 'John Smith', avatar: '👨', status: 'online', lastMessage: 'Hey, how are you?', unread: 2 },
  { id: '2', name: 'Sarah Johnson', avatar: '👩', status: 'online', lastMessage: 'The project looks great!', unread: 0 },
  { id: '3', name: 'Mike Wilson', avatar: '👨‍💼', status: 'away', lastMessage: 'Meeting at 3pm', unread: 1 },
  { id: '4', name: 'Emily Davis', avatar: '👩‍💻', status: 'offline', lastMessage: 'Thanks for the update', unread: 0 },
  { id: '5', name: 'Support Team', avatar: '🎧', status: 'online', lastMessage: 'How can we help?', unread: 0 },
]

export function LiveChat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0])
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'other', timestamp: new Date(Date.now() - 3600000), status: 'read' },
    { id: '2', text: 'I have a question about the CV Builder', sender: 'user', timestamp: new Date(Date.now() - 3500000), status: 'read' },
    { id: '3', text: 'Sure, what would you like to know?', sender: 'other', timestamp: new Date(Date.now() - 3400000), status: 'read' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages([...messages, message])
      setNewMessage('')

      // Simulate typing and response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! I\'ll get back to you shortly.',
          sender: 'other',
          timestamp: new Date(),
          status: 'delivered'
        }
        setMessages(prev => [...prev, response])
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Live Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time communication with your team and customers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{contacts.filter(c => c.status === 'online').length} Online</Badge>
            <Button size="sm">
              <Users className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Contacts Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              <div className="space-y-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-4 flex items-center space-x-3 transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                        {contact.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        contact.status === 'online' ? 'bg-green-500' :
                        contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{contact.name}</span>
                        {contact.unread > 0 && (
                          <Badge variant="danger" className="text-xs">{contact.unread}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xl">
                          {selectedContact.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                          selectedContact.status === 'online' ? 'bg-green-500' :
                          selectedContact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{selectedContact.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedContact.status === 'online' ? 'Online' :
                           selectedContact.status === 'away' ? 'Away' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      } rounded-2xl px-4 py-2`}>
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                          {message.sender === 'user' && (
                            message.status === 'read' ? (
                              <CheckCheck className="w-3 h-3 opacity-70" />
                            ) : (
                              <Check className="w-3 h-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a contact from the list to start chatting
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
