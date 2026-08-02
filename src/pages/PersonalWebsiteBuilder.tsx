import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { 
  Download, 
  Save, 
  Eye, 
  Sparkles,
  Plus,
  Trash2,
  Layout,
  Palette,
  FileText,
  Link as LinkIcon
} from 'lucide-react'

interface Section {
  id: string
  type: 'hero' | 'about' | 'services' | 'portfolio' | 'contact'
  title: string
  content: string
  imageUrl?: string
}

interface WebsiteData {
  personalInfo: {
    name: string
    tagline: string
    bio: string
    email: string
    phone: string
    location: string
    profileImage: string
  }
  socialLinks: {
    linkedin: string
    github: string
    twitter: string
    instagram: string
  }
  sections: Section[]
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
  { id: 'creative', name: 'Creative', description: 'Bold and artistic' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'bold', name: 'Bold', description: 'Eye-catching design' },
]

export function PersonalWebsiteBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    personalInfo: {
      name: '',
      tagline: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      profileImage: ''
    },
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    },
    sections: [
      { id: '1', type: 'hero', title: 'Welcome', content: 'Welcome to my personal website' },
      { id: '2', type: 'about', title: 'About Me', content: 'Tell visitors about yourself' },
      { id: '3', type: 'services', title: 'My Services', content: 'What you offer' },
      { id: '4', type: 'portfolio', title: 'Portfolio', content: 'Showcase your work' },
      { id: '5', type: 'contact', title: 'Contact', content: 'Get in touch' }
    ],
    theme: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#ef4444',
      backgroundColor: '#ffffff'
    }
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('websiteData', JSON.stringify(websiteData))
    }
  }, [websiteData, autoSave])

  const handleInputChange = (section: keyof WebsiteData, field: string, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: `New ${type}`,
      content: 'Add your content here'
    }
    setWebsiteData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }))
  }

  const deleteSection = (id: string) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }))
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setWebsiteData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          tagline: 'Creative Developer & Designer',
          bio: 'I craft beautiful digital experiences that make a difference. Passionate about clean code, stunning design, and user-centered solutions.'
        },
        sections: prev.sections.map(s => ({
          ...s,
          content: s.type === 'hero' ? 'Welcome to my creative space where ideas come to life' :
                   s.type === 'about' ? 'With over 5 years of experience in web development and design, I bring ideas to life through code and creativity.' :
                   s.type === 'services' ? 'Web Development • UI/UX Design • Branding • Consulting' :
                   s.type === 'portfolio' ? 'Check out my latest projects and creative work' :
                   s.type === 'contact' ? 'Let\'s work together on your next project' : s.content
        }))
      }))
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Personal Website Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your personal website
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Auto Save</span>
            </div>
            <Button variant="outline" size="sm" onClick={generateWithAI} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Choose Template</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Editor</h3>
                <Button variant="ghost" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 overflow-x-auto">
              {/* Personal Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Layout className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Your Name"
                    value={websiteData.personalInfo.name}
                    onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Tagline"
                    value={websiteData.personalInfo.tagline}
                    onChange={(e) => handleInputChange('personalInfo', 'tagline', e.target.value)}
                    placeholder="Creative Developer"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={websiteData.personalInfo.bio}
                      onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                      placeholder="Tell visitors about yourself..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={websiteData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    <Input
                      label="Phone"
                      value={websiteData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Input
                    label="Location"
                    value={websiteData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                  <Input
                    label="Profile Image URL"
                    value={websiteData.personalInfo.profileImage}
                    onChange={(e) => handleInputChange('personalInfo', 'profileImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Social Links
                </h4>
                <div className="space-y-4">
                  <Input
                    label="LinkedIn"
                    value={websiteData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <Input
                    label="GitHub"
                    value={websiteData.socialLinks.github}
                    onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                  <Input
                    label="Twitter"
                    value={websiteData.socialLinks.twitter}
                    onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                  <Input
                    label="Instagram"
                    value={websiteData.socialLinks.instagram}
                    onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme Colors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={websiteData.theme.primaryColor}
                      onChange={(e) => handleInputChange('theme', 'primaryColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={websiteData.theme.secondaryColor}
                      onChange={(e) => handleInputChange('theme', 'secondaryColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={websiteData.theme.backgroundColor}
                      onChange={(e) => handleInputChange('theme', 'backgroundColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Website Sections
                </h4>
                <div className="space-y-4">
                  {websiteData.sections.map((section) => (
                    <Card key={section.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">{section.type}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSection(section.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          label="Section Title"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          placeholder="Section Title"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                            placeholder="Section content..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        {section.type !== 'hero' && (
                          <Input
                            label="Section Image URL (Optional)"
                            value={section.imageUrl || ''}
                            onChange={(e) => updateSection(section.id, 'imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        )}
                      </div>
                    </Card>
                  ))}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <Button variant="outline" size="sm" onClick={() => addSection('hero')} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Hero
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addSection('about')} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      About
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addSection('services')} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Services
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addSection('portfolio')} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Portfolio
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addSection('contact')} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Live Preview</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 md:p-8 rounded-lg min-h-[600px] shadow-inner"
                style={{ backgroundColor: websiteData.theme.backgroundColor }}
              >
                {/* Hero Section */}
                {websiteData.sections.find(s => s.type === 'hero') && (
                  <div className="text-center mb-8">
                    {websiteData.personalInfo.profileImage ? (
                      <img
                        src={websiteData.personalInfo.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <h1 
                      className="text-3xl font-bold mb-2"
                      style={{ color: websiteData.theme.primaryColor }}
                    >
                      {websiteData.personalInfo.name || 'Your Name'}
                    </h1>
                    <p 
                      className="text-xl font-medium mb-4"
                      style={{ color: websiteData.theme.secondaryColor }}
                    >
                      {websiteData.personalInfo.tagline || 'Your Tagline'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {websiteData.personalInfo.bio || 'Your bio will appear here...'}
                    </p>
                  </div>
                )}

                {/* Other Sections */}
                {websiteData.sections.filter(s => s.type !== 'hero').map((section) => (
                  <div key={section.id} className="mb-8">
                    <h2 
                      className="text-2xl font-bold mb-4"
                      style={{ color: websiteData.theme.primaryColor }}
                    >
                      {section.title}
                    </h2>
                    {section.imageUrl && (
                      <img
                        src={section.imageUrl}
                        alt={section.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}

                {/* Contact Info */}
                <div className="text-center text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p>{websiteData.personalInfo.email || 'your@email.com'}</p>
                  <p>{websiteData.personalInfo.location || 'Your Location'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
