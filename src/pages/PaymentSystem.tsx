import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  CreditCard, 
  Lock, 
  Plus,
  Trash2,
  Calendar,
  Shield,
  Zap
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  expiry: string
  isDefault: boolean
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  method: string
}

const paymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4242', expiry: '12/25', isDefault: true },
  { id: '2', type: 'card', last4: '5555', expiry: '08/24', isDefault: false },
]

const transactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'CV Builder Pro', amount: 29.99, status: 'completed', method: 'Visa •••• 4242' },
  { id: '2', date: '2024-01-10', description: 'Logo Design', amount: 149.99, status: 'completed', method: 'Visa •••• 4242' },
  { id: '3', date: '2024-01-08', description: '3D Modeling', amount: 75.00, status: 'pending', method: 'Mastercard •••• 5555' },
]

export function PaymentSystem() {
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions' | 'settings'>('methods')
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your payment methods and transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('methods')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'methods'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Payment Methods</h2>
              <Button onClick={() => setShowAddCard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>

            {showAddCard ? (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Card</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => setShowAddCard(false)} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddCard(false)}>
                        Add Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        {method.isDefault && (
                          <Badge variant="success" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {method.type === 'card' ? 'Visa' : 'Bank Account'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Expires {method.expiry}
                      </p>
                      <div className="flex gap-2 mt-4">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm" className="flex-1">
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Security Notice */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Secure Payment Processing
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption and comply with PCI DSS standards to protect your data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {transaction.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={
                                transaction.status === 'completed' ? 'success' :
                                transaction.status === 'pending' ? 'warning' : 'danger'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                            ${transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Settings</h2>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Pay Settings</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable Auto-Pay</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically pay recurring invoices</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-0" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Payment Reminders</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified before payment due dates</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-primary rounded-full cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Billing Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Business Ave, City, Country"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tax ID (VAT)
                      </label>
                      <input
                        type="text"
                        placeholder="Your tax ID"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Billing Information</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Instant Payments
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enable instant payments for faster processing. Additional fees may apply.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
