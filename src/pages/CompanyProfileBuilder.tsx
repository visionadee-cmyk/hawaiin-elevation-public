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
  TrendingUp,
  Award,
  Target
} from 'lucide-react'
import jsPDF from 'jspdf'

interface Milestone {
  id: string
  year: string
  title: string
  description: string
}

interface Achievement {
  id: string
  title: string
  year: string
  description: string
}

interface CompanyProfileData {
  companyInfo: {
    name: string
    legalName: string
    registrationNumber: string
    taxId: string
    founded: string
    headquarters: string
    description: string
    mission: string
    vision: string
    values: string
    logo: string
  }
  businessDetails: {
    industry: string
    businessType: string
    size: string
    annualRevenue: string
    numberOfEmployees: string
    operatingCountries: string
  }
  leadership: {
    ceo: string
    cto: string
    cfo: string
    coo: string
  }
  milestones: Milestone[]
  achievements: Achievement[]
  contactInfo: {
    email: string
    phone: string
    address: string
    website: string
  }
}

const templates = [
  { id: 'comprehensive', name: 'Comprehensive', description: 'Full company profile' },
  { id: 'investor', name: 'Investor Ready', description: 'For presentations' },
  { id: 'partnership', name: 'Partnership', description: 'For B2B relations' },
  { id: 'public', name: 'Public', description: 'For general audience' },
]

export function CompanyProfileBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [profileData, setProfileData] = useState<CompanyProfileData>({
    companyInfo: {
      name: '',
      legalName: '',
      registrationNumber: '',
      taxId: '',
      founded: '',
      headquarters: '',
      description: '',
      mission: '',
      vision: '',
      values: '',
      logo: ''
    },
    businessDetails: {
      industry: '',
      businessType: '',
      size: '',
      annualRevenue: '',
      numberOfEmployees: '',
      operatingCountries: ''
    },
    leadership: {
      ceo: '',
      cto: '',
      cfo: '',
      coo: ''
    },
    milestones: [],
    achievements: [],
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      website: ''
    }
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('companyProfileData', JSON.stringify(profileData))
    }
  }, [profileData, autoSave])

  const handleInputChange = (section: keyof CompanyProfileData, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      year: '',
      title: '',
      description: ''
    }
    setProfileData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setProfileData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }))
  }

  const deleteMilestone = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      year: '',
      title: '',
      description: ''
    }
    setProfileData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }))
  }

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    }))
  }

  const deleteAchievement = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== id)
    }))
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          mission: 'To deliver innovative solutions that empower businesses to achieve their full potential through technology and excellence.',
          vision: 'To be the global leader in our industry, recognized for innovation, quality, and customer satisfaction.',
          values: 'Integrity, Innovation, Excellence, Customer Focus, Teamwork'
        },
        milestones: [
          { id: '1', year: '2010', title: 'Company Founded', description: 'Started with a vision to revolutionize the industry' },
          { id: '2', year: '2015', title: 'First Major Client', description: 'Secured partnership with Fortune 500 company' },
          { id: '3', year: '2020', title: 'International Expansion', description: 'Opened offices in 5 new countries' }
        ]
      }))
      setIsGenerating(false)
    }, 2000)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(24)
    doc.text(profileData.companyInfo.name || 'Company Name', 20, yPosition)
    yPosition += 15

    doc.setFontSize(14)
    doc.text('Company Profile', 20, yPosition)
    yPosition += 20

    doc.setFontSize(12)
    doc.text('Company Information', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(`Founded: ${profileData.companyInfo.founded}`, 20, yPosition)
    yPosition += 7
    doc.text(`Headquarters: ${profileData.companyInfo.headquarters}`, 20, yPosition)
    yPosition += 7
    doc.text(`Industry: ${profileData.businessDetails.industry}`, 20, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.text('Mission', 20, yPosition)
    yPosition += 7
    doc.setFontSize(10)
    const missionLines = doc.splitTextToSize(profileData.companyInfo.mission, 170)
    doc.text(missionLines, 20, yPosition)
    yPosition += missionLines.length * 7 + 10

    doc.setFontSize(12)
    doc.text('Vision', 20, yPosition)
    yPosition += 7
    doc.setFontSize(10)
    const visionLines = doc.splitTextToSize(profileData.companyInfo.vision, 170)
    doc.text(visionLines, 20, yPosition)
    yPosition += visionLines.length * 7 + 10

    if (profileData.milestones.length > 0) {
      doc.setFontSize(12)
      doc.text('Key Milestones', 20, yPosition)
      yPosition += 10
      doc.setFontSize(10)
      profileData.milestones.forEach(milestone => {
        doc.text(`${milestone.year} - ${milestone.title}`, 20, yPosition)
        yPosition += 7
      })
    }

    doc.save('company-profile.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Company Profile Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create comprehensive company profiles
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
            <Button size="sm" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
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
                  <div className="text-2xl mb-2">📋</div>
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
                    value={profileData.companyInfo.name}
                    onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
                    placeholder="Acme Corporation"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Legal Name"
                      value={profileData.companyInfo.legalName}
                      onChange={(e) => handleInputChange('companyInfo', 'legalName', e.target.value)}
                      placeholder="Acme Inc."
                    />
                    <Input
                      label="Registration Number"
                      value={profileData.companyInfo.registrationNumber}
                      onChange={(e) => handleInputChange('companyInfo', 'registrationNumber', e.target.value)}
                      placeholder="REG-12345"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Tax ID"
                      value={profileData.companyInfo.taxId}
                      onChange={(e) => handleInputChange('companyInfo', 'taxId', e.target.value)}
                      placeholder="TAX-12345"
                    />
                    <Input
                      label="Founded Year"
                      value={profileData.companyInfo.founded}
                      onChange={(e) => handleInputChange('companyInfo', 'founded', e.target.value)}
                      placeholder="2010"
                    />
                  </div>
                  <Input
                    label="Headquarters"
                    value={profileData.companyInfo.headquarters}
                    onChange={(e) => handleInputChange('companyInfo', 'headquarters', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={profileData.companyInfo.description}
                      onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                      placeholder="Describe your company..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mission Statement
                    </label>
                    <textarea
                      value={profileData.companyInfo.mission}
                      onChange={(e) => handleInputChange('companyInfo', 'mission', e.target.value)}
                      placeholder="Our mission is..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vision Statement
                    </label>
                    <textarea
                      value={profileData.companyInfo.vision}
                      onChange={(e) => handleInputChange('companyInfo', 'vision', e.target.value)}
                      placeholder="Our vision is..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Core Values
                    </label>
                    <textarea
                      value={profileData.companyInfo.values}
                      onChange={(e) => handleInputChange('companyInfo', 'values', e.target.value)}
                      placeholder="Integrity, Innovation, Excellence..."
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Input
                    label="Logo URL"
                    value={profileData.companyInfo.logo}
                    onChange={(e) => handleInputChange('companyInfo', 'logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Business Details
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Industry"
                    value={profileData.businessDetails.industry}
                    onChange={(e) => handleInputChange('businessDetails', 'industry', e.target.value)}
                    placeholder="Technology"
                  />
                  <Input
                    label="Business Type"
                    value={profileData.businessDetails.businessType}
                    onChange={(e) => handleInputChange('businessDetails', 'businessType', e.target.value)}
                    placeholder="Private Limited"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Company Size"
                      value={profileData.businessDetails.size}
                      onChange={(e) => handleInputChange('businessDetails', 'size', e.target.value)}
                      placeholder="51-200 employees"
                    />
                    <Input
                      label="Annual Revenue"
                      value={profileData.businessDetails.annualRevenue}
                      onChange={(e) => handleInputChange('businessDetails', 'annualRevenue', e.target.value)}
                      placeholder="$1M - $10M"
                    />
                  </div>
                  <Input
                    label="Number of Employees"
                    value={profileData.businessDetails.numberOfEmployees}
                    onChange={(e) => handleInputChange('businessDetails', 'numberOfEmployees', e.target.value)}
                    placeholder="150"
                  />
                  <Input
                    label="Operating Countries"
                    value={profileData.businessDetails.operatingCountries}
                    onChange={(e) => handleInputChange('businessDetails', 'operatingCountries', e.target.value)}
                    placeholder="USA, UK, Canada, Australia"
                  />
                </div>
              </div>

              {/* Leadership */}
              <div>
                <h4 className="font-semibold mb-4">Leadership Team</h4>
                <div className="space-y-4">
                  <Input
                    label="CEO"
                    value={profileData.leadership.ceo}
                    onChange={(e) => handleInputChange('leadership', 'ceo', e.target.value)}
                    placeholder="John Smith"
                  />
                  <Input
                    label="CTO"
                    value={profileData.leadership.cto}
                    onChange={(e) => handleInputChange('leadership', 'cto', e.target.value)}
                    placeholder="Jane Doe"
                  />
                  <Input
                    label="CFO"
                    value={profileData.leadership.cfo}
                    onChange={(e) => handleInputChange('leadership', 'cfo', e.target.value)}
                    placeholder="Mike Johnson"
                  />
                  <Input
                    label="COO"
                    value={profileData.leadership.coo}
                    onChange={(e) => handleInputChange('leadership', 'coo', e.target.value)}
                    placeholder="Sarah Williams"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Key Milestones
                </h4>
                <div className="space-y-4">
                  {profileData.milestones.map((milestone) => (
                    <Card key={milestone.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">Milestone</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMilestone(milestone.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Year"
                            value={milestone.year}
                            onChange={(e) => updateMilestone(milestone.id, 'year', e.target.value)}
                            placeholder="2020"
                          />
                          <Input
                            label="Title"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                            placeholder="Milestone Title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                            placeholder="Milestone description..."
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addMilestone} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Achievements & Awards
                </h4>
                <div className="space-y-4">
                  {profileData.achievements.map((achievement) => (
                    <Card key={achievement.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">Achievement</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAchievement(achievement.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Year"
                            value={achievement.year}
                            onChange={(e) => updateAchievement(achievement.id, 'year', e.target.value)}
                            placeholder="2023"
                          />
                          <Input
                            label="Title"
                            value={achievement.title}
                            onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                            placeholder="Award Title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={achievement.description}
                            onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                            placeholder="Achievement description..."
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addAchievement} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                    placeholder="info@company.com"
                  />
                  <Input
                    label="Phone"
                    value={profileData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                  <Input
                    label="Address"
                    value={profileData.contactInfo.address}
                    onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                    placeholder="123 Business Ave, City, Country"
                  />
                  <Input
                    label="Website"
                    value={profileData.contactInfo.website}
                    onChange={(e) => handleInputChange('contactInfo', 'website', e.target.value)}
                    placeholder="https://company.com"
                  />
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
                {/* Header */}
                <div className="text-center mb-8">
                  {profileData.companyInfo.logo && (
                    <img
                      src={profileData.companyInfo.logo}
                      alt="Company Logo"
                      className="h-20 mx-auto mb-4"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileData.companyInfo.name || 'Company Name'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData.companyInfo.legalName || 'Legal Name'}
                  </p>
                </div>

                {/* Company Overview */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Company Overview</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Founded:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{profileData.companyInfo.founded || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Headquarters:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{profileData.companyInfo.headquarters || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Industry:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{profileData.businessDetails.industry || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Employees:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{profileData.businessDetails.numberOfEmployees || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Mission & Vision */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mission & Vision</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mission</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {profileData.companyInfo.mission || 'Your mission statement...'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vision</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {profileData.companyInfo.vision || 'Your vision statement...'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Core Values</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {profileData.companyInfo.values || 'Your core values...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {profileData.milestones.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Milestones</h2>
                    <div className="space-y-3">
                      {profileData.milestones.map((milestone) => (
                        <div key={milestone.id} className="border-l-4 border-primary pl-4">
                          <div className="font-semibold text-gray-900 dark:text-white">{milestone.year} - {milestone.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {profileData.achievements.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements & Awards</h2>
                    <div className="space-y-3">
                      {profileData.achievements.map((achievement) => (
                        <div key={achievement.id} className="bg-primary/10 p-3 rounded-lg">
                          <div className="font-semibold text-gray-900 dark:text-white">{achievement.year} - {achievement.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="text-center text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p>{profileData.contactInfo.email}</p>
                  <p>{profileData.contactInfo.phone}</p>
                  <p>{profileData.contactInfo.address}</p>
                  <p>{profileData.contactInfo.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
