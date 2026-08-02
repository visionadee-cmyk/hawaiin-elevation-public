import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Play, Download, ExternalLink, Volume2 } from 'lucide-react'

const videos3D = [
  { name: 'Maabinhura', src: '/3d video/Maabinhura_.mov', description: 'Residential project visualization' },
  { name: 'New Normal Dining', src: '/3d video/New_Normal_dining.mov', description: 'Modern dining space design' },
  { name: 'Fareast Upscale', src: '/3d video/fareast_upscale.mp4', description: 'Luxury interior rendering' },
  { name: 'Independence', src: '/3d video/independence.mov', description: 'Celebration animation' },
]

export function Videos3DPortfolio() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos3D[0] | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              3D Video Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Watch our 3D animations and video productions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{videos3D.length} Videos</Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* 3D Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos3D.map((video, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                <video 
                  src={video.src} 
                  className="w-full h-full object-cover"
                  muted
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {video.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {video.description}
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedVideo(video)}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Watch with Sound
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for video playback */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative max-w-5xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video">
                <video 
                  src={selectedVideo.src} 
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedVideo.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Custom 3D Animations?</h2>
              <p className="text-white/80 mb-6">
                Our expert 3D animators can create stunning videos for your projects.
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
