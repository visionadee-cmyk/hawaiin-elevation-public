import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Palette, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  Layers,
  Download,
  Sparkles,
  Eye,
  Save
} from 'lucide-react'

interface DesignTool {
  id: string
  name: string
  description: string
  icon: any
  category: string
}

const designTools: DesignTool[] = [
  { id: 'logo', name: 'Logo Maker', description: 'Create professional logos', icon: ImageIcon, category: 'Branding' },
  { id: 'banner', name: 'Banner Designer', description: 'Design stunning banners', icon: Layout, category: 'Marketing' },
  { id: 'poster', name: 'Poster Creator', description: 'Create eye-catching posters', icon: Layers, category: 'Print' },
  { id: 'social', name: 'Social Media', description: 'Social media graphics', icon: ImageIcon, category: 'Marketing' },
  { id: 'business-card', name: 'Business Cards', description: 'Professional business cards', icon: Type, category: 'Branding' },
  { id: 'flyer', name: 'Flyer Maker', description: 'Marketing flyers', icon: Palette, category: 'Print' },
  { id: 'thumbnail', name: 'Thumbnail Creator', description: 'YouTube thumbnails', icon: ImageIcon, category: 'Video' },
  { id: 'presentation', name: 'Presentation', description: 'Slide designs', icon: Layout, category: 'Business' },
]

const categories = ['All', 'Branding', 'Marketing', 'Print', 'Video', 'Business']

export function GraphicDesignTools() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const filteredTools = selectedCategory === 'All' 
    ? designTools 
    : designTools.filter(tool => tool.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Graphic Design Tools
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create stunning graphics for your business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Projects
            </Button>
            <Button size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Design
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

        {/* Tools Grid */}
        {!selectedTool ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                      <Badge variant="info">{tool.category}</Badge>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTool(null)} className="mb-6">
              ← Back to Tools
            </Button>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {designTools.find(t => t.id === selectedTool)?.name}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 min-h-[500px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Design Canvas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start creating your design here
                    </p>
                    <Button>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
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
