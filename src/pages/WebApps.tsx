import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ExternalLink, Code, Check, ArrowRight } from 'lucide-react'

interface WebApp {
  name: string
  description: string
  image: string
  category: string
  features: string[]
  status: string
  link: string
}

const webApps: WebApp[] = [
  {
    name: 'Park BBQ Kitchen',
    description: 'Booking system for Park BBQ Kitchen events. Reserve the venue for your special occasions with easy online booking.',
    image: 'https://parkbbqkitchen.hawadaily.com/logo/logo.jpeg',
    category: 'Booking System',
    features: ['Online Booking', 'Event Management', 'User Manual', 'FAQ Support'],
    status: 'Live',
    link: 'https://parkbbqkitchen.hawadaily.com/'
  },
  {
    name: 'Hawainn Khabaru',
    description: 'Modern Maldives news portal with full Dhivehi RTL support and PWA experience for the Maldivian community.',
    image: 'https://ahdhamu-news.vercel.app/logo.png',
    category: 'News & Media',
    features: ['Dhivehi RTL Support', 'PWA Experience', 'Modern Design', 'Daily Updates'],
    status: 'Live',
    link: 'https://ahdhamu-news.vercel.app/'
  },
  {
    name: 'Maa Wadi Mv',
    description: 'Smart furniture planning tool with precise measurements, material optimization, and instant pricing for custom furniture.',
    image: 'https://maa-wadi-mv.vercel.app/assets/logo.png',
    category: 'Design Tool',
    features: ['Material Optimization', 'Instant Pricing', 'Custom Designs', 'Quote Generation'],
    status: 'Live',
    link: 'https://maa-wadi-mv.vercel.app/'
  },
  {
    name: 'Loavashi Hub',
    description: 'Modern cafe and restaurant management system with POS, admin dashboard, inventory, staff, reports, and PWA support.',
    image: 'https://loavashihub-cafe.vercel.app/logo.jpeg',
    category: 'Restaurant Management',
    features: ['POS System', 'Inventory Management', 'Staff Management', 'PWA Support'],
    status: 'Live',
    link: 'https://loavashihub-cafe.vercel.app/'
  },
  {
    name: 'Hawaiin Elevation',
    description: 'Complete tender and procurement management system for Hawaiin Elevation Pvt Ltd with PWA support.',
    image: 'https://hawaiin-elevation.vercel.app/logo/icon-192.png',
    category: 'Business Management',
    features: ['Tender Management', 'Procurement Tracking', 'PWA Support', 'Reporting'],
    status: 'Live',
    link: 'https://hawaiin-elevation.vercel.app/'
  },
  {
    name: 'Ungu Viyafaari',
    description: 'Business management system for comprehensive business operations and administration.',
    image: 'https://ungu-viyafaari-mv.vercel.app/logo.png',
    category: 'Business Management',
    features: ['Business Operations', 'Administration', 'PWA Support', 'Modern UI'],
    status: 'Live',
    link: 'https://ungu-viyafaari-mv.vercel.app/'
  },
  {
    name: 'HR Factory',
    description: 'Comprehensive HR management platform for employee management, payroll, and HR operations.',
    image: 'https://hawaain-hr-pro.vercel.app/logo.png',
    category: 'HR Management',
    features: ['Employee Management', 'Payroll', 'HR Operations', 'PWA Support'],
    status: 'Live',
    link: 'https://hawaain-hr-pro.vercel.app/'
  },
  {
    name: 'Park Pro-Active',
    description: 'Engineering operations management system for efficient project and operations tracking.',
    image: 'https://park-pro-active-eta.vercel.app/logo.png',
    category: 'Engineering',
    features: ['Operations Management', 'Project Tracking', 'PWA Support', 'Reporting'],
    status: 'Live',
    link: 'https://park-pro-active-eta.vercel.app/'
  },
  {
    name: 'Fixora',
    description: 'Computerized Maintenance Management System built for zero downtime with comprehensive asset tracking.',
    image: 'https://fixora-topaz.vercel.app/logo/logo.png',
    category: 'Maintenance',
    features: ['Asset Management', 'Maintenance Tracking', 'Zero Downtime', 'PWA Support'],
    status: 'Live',
    link: 'https://fixora-topaz.vercel.app/'
  },
  {
    name: 'MNDF Toolkit Pro',
    description: 'Tool and asset management system designed for MNDF operations with comprehensive tracking capabilities.',
    image: 'https://mndf-toolkit-pro.vercel.app/logo.png',
    category: 'Asset Management',
    features: ['Tool Management', 'Asset Tracking', 'PWA Support', 'Reporting'],
    status: 'Live',
    link: 'https://mndf-toolkit-pro.vercel.app/'
  },
  {
    name: 'Fannu Bazaar',
    description: 'Service marketplace connecting customers with skilled workers for various services.',
    image: 'https://fannu-bazaar.vercel.app/logo.png',
    category: 'Marketplace',
    features: ['Service Booking', 'Worker Profiles', 'PWA Support', 'Reviews'],
    status: 'Live',
    link: 'https://fannu-bazaar.vercel.app/'
  },
  {
    name: 'Exam Lab MV',
    description: 'O Level & A Level exam practice platform for students in the Maldives with comprehensive study materials.',
    image: 'https://exam-lab-maldives.vercel.app/logo.png',
    category: 'Education',
    features: ['Exam Practice', 'Study Materials', 'PWA Support', 'Progress Tracking'],
    status: 'Live',
    link: 'https://exam-lab-maldives.vercel.app/'
  },
  {
    name: 'Hawa Daily',
    description: 'Modern Maldives news portal with full Dhivehi RTL support and PWA experience. Provides daily news updates and content for the Maldivian community.',
    image: 'https://www.hawadaily.com/logo.png',
    category: 'News & Media',
    features: ['Dhivehi RTL Support', 'PWA Experience', 'Modern Mobile Design', 'Daily News Updates'],
    status: 'Live',
    link: 'https://www.hawadaily.com/'
  }
]

export function WebApps() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Web Applications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Innovative digital solutions for business and creative challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {webApps.map((app, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-6">
                <img 
                  src={app.image} 
                  alt={app.name} 
                  className="max-h-full max-w-full object-contain"
                />
                <Badge 
                  className={`absolute top-4 right-4 ${
                    app.status === 'Live' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {app.status}
                </Badge>
              </div>
              <CardContent className="p-6">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mb-3 inline-block">
                  {app.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {app.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {app.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex} 
                      className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
                <a 
                  href={app.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  View Application
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary to-primary/90 text-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Custom Development</h3>
            <p className="text-white/90 mb-6">
              Need a custom web application for your business? I specialize in creating tailored solutions that address specific operational challenges and improve efficiency.
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
