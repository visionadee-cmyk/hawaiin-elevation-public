import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Box, 
  Layers, 
  Sparkles, 
  Download,
  Eye,
  ShoppingCart,
  Star,
  Upload
} from 'lucide-react'

interface Service3D {
  id: string
  name: string
  description: string
  price: string
  icon: any
  category: string
  rating: number
}

const services3D: Service3D[] = [
  { 
    id: 'modeling', 
    name: '3D Modeling', 
    description: 'Custom 3D models for games, products, and architecture', 
    price: 'From $50', 
    icon: Box, 
    category: 'Modeling',
    rating: 4.8
  },
  { 
    id: 'animation', 
    name: '3D Animation', 
    description: 'Professional 3D animations for videos and presentations', 
    price: 'From $100', 
    icon: Sparkles, 
    category: 'Animation',
    rating: 4.9
  },
  { 
    id: 'rendering', 
    name: '3D Rendering', 
    description: 'High-quality photorealistic renders', 
    price: 'From $75', 
    icon: Box, 
    category: 'Rendering',
    rating: 4.7
  },
  { 
    id: 'printing', 
    name: '3D Printing', 
    description: '3D printing services for prototypes and products', 
    price: 'From $25', 
    icon: Layers, 
    category: 'Printing',
    rating: 4.6
  },
  { 
    id: 'scanning', 
    name: '3D Scanning', 
    description: 'Convert physical objects to 3D digital models', 
    price: 'From $80', 
    icon: Box, 
    category: 'Scanning',
    rating: 4.5
  },
  { 
    id: 'vr-ar', 
    name: 'VR/AR Development', 
    description: 'Virtual and augmented reality experiences', 
    price: 'From $200', 
    icon: Sparkles, 
    category: 'VR/AR',
    rating: 4.9
  },
]

const categories = ['All', 'Modeling', 'Animation', 'Rendering', 'Printing', 'Scanning', 'VR/AR']

export function Services3D() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const filteredServices = selectedCategory === 'All' 
    ? services3D 
    : services3D.filter(service => service.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              3D Services
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Professional 3D modeling, animation, and printing services
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
            </Button>
            <Button size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {!selectedService ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{service.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">{service.category}</Badge>
                      <span className="font-bold text-primary">{service.price}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div>
            <Button variant="outline" size="sm" onClick={() => setSelectedService(null)} className="mb-6">
              ← Back to Services
            </Button>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {services3D.find(s => s.id === selectedService)?.name}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                      <Box className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        3D Preview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Interactive 3D model viewer
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Model
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Base Price</span>
                        <span className="font-bold text-primary">{services3D.find(s => s.id === selectedService)?.price}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Delivery Time</span>
                        <span className="font-semibold text-gray-900 dark:text-white">3-5 Business Days</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Revisions</span>
                        <span className="font-semibold text-gray-900 dark:text-white">3 Included</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add-ons</h3>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                        <input type="checkbox" className="mr-3" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">Express Delivery</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">+ $50</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                        <input type="checkbox" className="mr-3" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">Source Files</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">+ $30</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                        <input type="checkbox" className="mr-3" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">Additional Revisions</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">+ $20 each</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button size="lg" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Proceed to Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
