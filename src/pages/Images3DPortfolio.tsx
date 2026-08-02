import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Download, ZoomIn, ExternalLink } from 'lucide-react'

const images3D = [
  '/3d images/Blender_Image_(1).jpg',
  '/3d images/Blender_Image_(2).jpg',
  '/3d images/Blender_Image_(3).jpg',
  '/3d images/Blender_Image_(4).jpg',
  '/3d images/Blender_Image_(5).jpg',
  '/3d images/Blender_Image_(6).jpg',
  '/3d images/Blender_Image_(7).jpg',
  '/3d images/Blender_Image_(8).jpg',
  '/3d images/Blender_Image_(9).jpg',
  '/3d images/Blender_Image_(10).jpg',
  '/3d images/Blender_Image_(11).jpg',
  '/3d images/Blender_Image_(12).jpg',
  '/3d images/Blender_Image_(13).jpg',
  '/3d images/Blender_Image_(14).jpg',
  '/3d images/Blender_Image_(15).jpg',
  '/3d images/Blender_Image_(16).jpg',
  '/3d images/Blender_Image_(17).jpg',
  '/3d images/Blender_Image_(18).jpg',
  '/3d images/Blender_Image_(19).jpg',
  '/3d images/Blender_Image_(20).jpg',
  '/3d images/Blender_Image_(21).jpg',
]

export function Images3DPortfolio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              3D Image Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our stunning 3D renderings and visualizations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{images3D.length} Renders</Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* 3D Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images3D.map((image, index) => (
            <div 
              key={index} 
              className="cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative">
                  <img 
                    src={image} 
                    alt={`3D Render ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged 3D render" 
                className="max-h-[85vh] max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Custom 3D Renders?</h2>
              <p className="text-white/80 mb-6">
                Our expert 3D artists can bring your vision to life with stunning visualizations.
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
