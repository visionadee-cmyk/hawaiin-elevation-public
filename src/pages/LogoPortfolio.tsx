import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Download, ZoomIn, ExternalLink } from 'lucide-react'

const logos = [
  '/logo/logo.png',
  '/logo/logo (1).png',
  '/logo/logo (2).png',
  '/logo/logo (3).png',
  '/logo/logo (4).png',
  '/logo/logo (5).png',
  '/logo/logo (6).png',
  '/logo/logo (7).png',
  '/logo/logo (8).png',
  '/logo/logo (9).png',
  '/logo/logo (10).png',
  '/logo/logo (11).png',
  '/logo/logo (12).JPG',
  '/logo/logo (2).jpg',
  '/logo/logo (3).jpg',
  '/logo/logo (4).jpg',
  '/logo/logo (5).jpg',
  '/logo/logo (6).jpg',
  '/logo/logo (7).jpg',
  '/logo/logo (1).JPG',
]

export function LogoPortfolio() {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Logo Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Creative logo designs for brands worldwide
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{logos.length} Designs</Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="cursor-pointer group"
              onClick={() => setSelectedLogo(logo)}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square bg-white dark:bg-gray-700 flex items-center justify-center p-4 relative">
                  <img 
                    src={logo} 
                    alt={`Logo ${index + 1}`} 
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Modal for enlarged view */}
        {selectedLogo && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLogo(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => setSelectedLogo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedLogo} 
                alt="Enlarged logo" 
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need a Custom Logo?</h2>
              <p className="text-white/80 mb-6">
                Let our expert designers create a unique logo that represents your brand perfectly.
              </p>
              <Button size="lg" variant="secondary" className="gap-2">
                <ExternalLink className="w-5 h-5" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
