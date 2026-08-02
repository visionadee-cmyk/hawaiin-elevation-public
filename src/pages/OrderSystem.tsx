import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  cardNumber: string
  expiry: string
  cvv: string
}

export function OrderSystem() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'CV Builder Pro', price: 29.99, quantity: 1, image: '📄' },
    { id: '2', name: 'Logo Design', price: 149.99, quantity: 1, image: '🎨' },
  ])
  const [step, setStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ))
  }

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = cartTotal * 0.1
  const grandTotal = cartTotal + shipping + tax

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log('Order submitted:', { cart, orderData, total: grandTotal })
    alert('Order submitted successfully!')
    setStep(4)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your order securely
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{cart.length} Items</Badge>
            <Badge variant="info">${grandTotal.toFixed(2)}</Badge>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                              {item.image}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Information</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={orderData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={orderData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <Input
                      label="Phone"
                      value={orderData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                    <Input
                      label="Address"
                      value={orderData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main St"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Input
                        label="City"
                        value={orderData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        label="State"
                        value={orderData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                      />
                      <Input
                        label="ZIP"
                        value={orderData.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        placeholder="12345"
                      />
                      <Input
                        label="Country"
                        value={orderData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-primary/10 rounded-lg mb-6">
                      <CreditCard className="w-8 h-8 text-primary mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Secure Payment</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your payment information is encrypted</p>
                      </div>
                    </div>
                    <Input
                      label="Card Number"
                      value={orderData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={orderData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                        placeholder="MM/YY"
                      />
                      <Input
                        label="CVV"
                        value={orderData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Order Completed!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for your order. You will receive a confirmation email shortly.
                    </p>
                    <Button onClick={() => setStep(1)}>
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                {step === 1 && cart.length > 0 && (
                  <Button onClick={() => setStep(2)}>
                    Continue to Shipping <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {step === 2 && (
                  <Button onClick={() => setStep(3)}>
                    Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {step === 3 && (
                  <Button onClick={handleSubmit}>
                    Place Order <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          {item.image}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-primary">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated delivery: 3-5 business days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
