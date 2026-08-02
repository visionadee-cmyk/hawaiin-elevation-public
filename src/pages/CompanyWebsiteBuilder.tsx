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
  Building2,
  Palette,
  FileText,
  Users,
  Star
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
}

interface CompanyWebsiteData {
  companyInfo: {
    name: string
    tagline: string
    description: string
    founded: string
    employees: string
    logo: string
    heroImage: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
    website: string
  }
  socialLinks: {
    linkedin: string
    twitter: string
    facebook: string
    instagram: string
  }
  services: Service[]
  team: TeamMember[]
  testimonials: Testimonial[]
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

const templates = [
  { id: 'corporate', name: 'Corporate', description: 'Professional business style' },
  { id: 'startup', name: 'Startup', description: 'Modern and dynamic' },
  { id: 'agency', name: 'Agency', description: 'Creative and bold' },
  { id: 'tech', name: 'Tech', description: 'Innovation focused' },
]

export function CompanyWebsiteBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('corporate')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [websiteData, setWebsiteData] = useState<CompanyWebsiteData>({
    companyInfo: {
      name: '',
      tagline: '',
      description: '',
      founded: '',
      employees: '',
      logo: '',
      heroImage: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      website: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    services: [],
    team: [],
    testimonials: [],
    theme: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#3b82f6',
      accentColor: '#10b981'
    }
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('companyWebsiteData', JSON.stringify(websiteData))
    }
  }, [websiteData, autoSave])

  const handleInputChange = (section: keyof CompanyWebsiteData, field: string, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: '⚡'
    }
    setWebsiteData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }))
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      services: prev.services.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }))
  }

  const deleteService = (id: string) => {
    setWebsiteData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }))
  }

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      bio: '',
      imageUrl: ''
    }
    setWebsiteData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }))
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      team: prev.team.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }))
  }

  const deleteTeamMember = (id: string) => {
    setWebsiteData(prev => ({
      ...prev,
      team: prev.team.filter(m => m.id !== id)
    }))
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5
    }
    setWebsiteData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }))
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setWebsiteData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      )
    }))
  }

  const deleteTestimonial = (id: string) => {
    setWebsiteData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }))
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setWebsiteData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          tagline: 'Innovating the Future',
          description: 'We are a forward-thinking company dedicated to delivering exceptional solutions that drive business growth and success.'
        },
        services: [
          { id: '1', title: 'Consulting', description: 'Expert business consulting services', icon: '💼' },
          { id: '2', title: 'Development', description: 'Custom software development', icon: '💻' },
          { id: '3', title: 'Design', description: 'Creative design solutions', icon: '🎨' }
        ]
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
              Company Website Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create professional company websites
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
                  <div className="text-2xl mb-2">🏢</div>
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
              {/* Company Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    value={websiteData.companyInfo.name}
                    onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
                    placeholder="Acme Corporation"
                  />
                  <Input
                    label="Tagline"
                    value={websiteData.companyInfo.tagline}
                    onChange={(e) => handleInputChange('companyInfo', 'tagline', e.target.value)}
                    placeholder="Innovating the Future"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={websiteData.companyInfo.description}
                      onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                      placeholder="Describe your company..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Founded Year"
                      value={websiteData.companyInfo.founded}
                      onChange={(e) => handleInputChange('companyInfo', 'founded', e.target.value)}
                      placeholder="2010"
                    />
                    <Input
                      label="Number of Employees"
                      value={websiteData.companyInfo.employees}
                      onChange={(e) => handleInputChange('companyInfo', 'employees', e.target.value)}
                      placeholder="50-100"
                    />
                  </div>
                  <Input
                    label="Logo URL"
                    value={websiteData.companyInfo.logo}
                    onChange={(e) => handleInputChange('companyInfo', 'logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <Input
                    label="Hero Image URL"
                    value={websiteData.companyInfo.heroImage}
                    onChange={(e) => handleInputChange('companyInfo', 'heroImage', e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={websiteData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                    placeholder="info@company.com"
                  />
                  <Input
                    label="Phone"
                    value={websiteData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                  <Input
                    label="Address"
                    value={websiteData.contactInfo.address}
                    onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                    placeholder="123 Business Ave, City, Country"
                  />
                  <Input
                    label="Website"
                    value={websiteData.contactInfo.website}
                    onChange={(e) => handleInputChange('contactInfo', 'website', e.target.value)}
                    placeholder="https://company.com"
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
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={websiteData.theme.accentColor}
                      onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Services
                </h4>
                <div className="space-y-4">
                  {websiteData.services.map((service) => (
                    <Card key={service.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{service.icon}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteService(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          label="Service Title"
                          value={service.title}
                          onChange={(e) => updateService(service.id, 'title', e.target.value)}
                          placeholder="Service Name"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateService(service.id, 'description', e.target.value)}
                            placeholder="Service description..."
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addService} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>

              {/* Team */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Team Members
                </h4>
                <div className="space-y-4">
                  {websiteData.team.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">Team Member</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTeamMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          label="Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          placeholder="John Doe"
                        />
                        <Input
                          label="Role"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          placeholder="CEO"
                        />
                        <Input
                          label="Photo URL"
                          value={member.imageUrl}
                          onChange={(e) => updateTeamMember(member.id, 'imageUrl', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addTeamMember} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
              </div>

              {/* Testimonials */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Testimonials
                </h4>
                <div className="space-y-4">
                  {websiteData.testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">Testimonial</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          label="Client Name"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                          placeholder="Client Name"
                        />
                        <Input
                          label="Company"
                          value={testimonial.company}
                          onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Testimonial
                          </label>
                          <textarea
                            value={testimonial.content}
                            onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                            placeholder="Client testimonial..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addTestimonial} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
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
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg min-h-[600px] shadow-inner">
                {/* Hero */}
                <div className="text-center mb-8">
                  {websiteData.companyInfo.logo && (
                    <img
                      src={websiteData.companyInfo.logo}
                      alt="Company Logo"
                      className="h-16 mx-auto mb-4"
                    />
                  )}
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ color: websiteData.theme.primaryColor }}
                  >
                    {websiteData.companyInfo.name || 'Company Name'}
                  </h1>
                  <p 
                    className="text-xl font-medium mb-4"
                    style={{ color: websiteData.theme.secondaryColor }}
                  >
                    {websiteData.companyInfo.tagline || 'Your Tagline'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {websiteData.companyInfo.description || 'Company description...'}
                  </p>
                </div>

                {/* Services */}
                {websiteData.services.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {websiteData.services.map((service) => (
                        <div key={service.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="text-2xl mb-2">{service.icon}</div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team */}
                {websiteData.team.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Team</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {websiteData.team.map((member) => (
                        <div key={member.id} className="text-center">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          )}
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{member.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="text-center text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p>{websiteData.contactInfo.email}</p>
                  <p>{websiteData.contactInfo.phone}</p>
                  <p>{websiteData.contactInfo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
