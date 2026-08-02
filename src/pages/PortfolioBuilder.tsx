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
  Image as ImageIcon,
  Layout,
  Palette,
  Globe,
  ExternalLink
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  technologies: string[]
}

interface PortfolioData {
  personalInfo: {
    name: string
    title: string
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
    website: string
  }
  projects: Project[]
  skills: string[]
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
  { id: 'creative', name: 'Creative', description: 'Bold and artistic' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'professional', name: 'Professional', description: 'Corporate style' },
]

export function PortfolioBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
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
      website: ''
    },
    projects: [],
    skills: []
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData))
    }
  }, [portfolioData, autoSave])

  const handleInputChange = (section: keyof PortfolioData, field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      technologies: []
    }
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }))
  }

  const deleteProject = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  const addSkill = () => {
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }))
  }

  const updateSkill = (index: number, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? value : s)
    }))
  }

  const deleteSkill = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setPortfolioData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          title: 'Full Stack Developer & UI/UX Designer',
          bio: 'Passionate developer with 5+ years of experience building beautiful, functional web applications. I love turning complex problems into simple, elegant solutions.'
        },
        skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 'Git', 'AWS']
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
              Portfolio Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create stunning portfolio websites
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
                  <div className="text-2xl mb-2">🎨</div>
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
                    label="Full Name"
                    value={portfolioData.personalInfo.name}
                    onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Professional Title"
                    value={portfolioData.personalInfo.title}
                    onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                    placeholder="Full Stack Developer"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={portfolioData.personalInfo.bio}
                      onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={portfolioData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    <Input
                      label="Phone"
                      value={portfolioData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Input
                    label="Location"
                    value={portfolioData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                  <Input
                    label="Profile Image URL"
                    value={portfolioData.personalInfo.profileImage}
                    onChange={(e) => handleInputChange('personalInfo', 'profileImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Social Links
                </h4>
                <div className="space-y-4">
                  <Input
                    label="LinkedIn"
                    value={portfolioData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <Input
                    label="GitHub"
                    value={portfolioData.socialLinks.github}
                    onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                  <Input
                    label="Twitter"
                    value={portfolioData.socialLinks.twitter}
                    onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                  <Input
                    label="Website"
                    value={portfolioData.socialLinks.website}
                    onChange={(e) => handleInputChange('socialLinks', 'website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Skills
                </h4>
                <div className="space-y-2">
                  {portfolioData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder="JavaScript"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSkill} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Projects
                </h4>
                <div className="space-y-4">
                  {portfolioData.projects.map((project) => (
                    <Card key={project.id} className="p-4">
                      <div className="space-y-3">
                        <Input
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="My Awesome Project"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Describe your project..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <Input
                          label="Project Image URL"
                          value={project.imageUrl}
                          onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                          placeholder="https://example.com/project.jpg"
                        />
                        <Input
                          label="Project URL"
                          value={project.projectUrl}
                          onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                          placeholder="https://myproject.com"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Project
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addProject} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
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
                <div className="text-center mb-8">
                  {portfolioData.personalInfo.profileImage ? (
                    <img
                      src={portfolioData.personalInfo.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {portfolioData.personalInfo.name || 'Your Name'}
                  </h2>
                  <p className="text-primary font-medium">
                    {portfolioData.personalInfo.title || 'Your Title'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                    {portfolioData.personalInfo.bio || 'Your bio will appear here...'}
                  </p>
                </div>

                {/* Skills */}
                {portfolioData.skills.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.skills.filter(s => s).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {portfolioData.projects.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Projects</h3>
                    <div className="space-y-4">
                      {portfolioData.projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h4 className="font-semibold text-gray-900 dark:text-white">{project.title || 'Project Title'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description || 'Project description...'}</p>
                          {project.projectUrl && (
                            <a
                              href={project.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary text-sm mt-2 hover:underline"
                            >
                              View Project <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>{portfolioData.personalInfo.email || 'your@email.com'}</p>
                  <p>{portfolioData.personalInfo.location || 'Your Location'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
