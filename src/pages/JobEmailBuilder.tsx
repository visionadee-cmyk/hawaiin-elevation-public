import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { 
  Copy, 
  Save, 
  Eye, 
  Sparkles,
  Mail,
  User,
  Building2,
  FileText,
  Send
} from 'lucide-react'

interface EmailData {
  senderInfo: {
    name: string
    email: string
    phone: string
  }
  recipientInfo: {
    name: string
    email: string
    company: string
  }
  jobDetails: {
    position: string
    jobReference: string
  }
  emailContent: {
    subject: string
    greeting: string
    introduction: string
    body: string
    conclusion: string
    signoff: string
  }
}

const templates = [
  { id: 'formal', name: 'Formal', description: 'Professional and traditional' },
  { id: 'modern', name: 'Modern', description: 'Contemporary and concise' },
  { id: 'enthusiastic', name: 'Enthusiastic', description: 'Passionate and energetic' },
  { id: 'direct', name: 'Direct', description: 'Straight to the point' },
]

export function JobEmailBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('formal')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const [emailData, setEmailData] = useState<EmailData>({
    senderInfo: {
      name: '',
      email: '',
      phone: ''
    },
    recipientInfo: {
      name: '',
      email: '',
      company: ''
    },
    jobDetails: {
      position: '',
      jobReference: ''
    },
    emailContent: {
      subject: '',
      greeting: 'Dear Hiring Manager,',
      introduction: '',
      body: '',
      conclusion: '',
      signoff: 'Best regards,'
    }
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('emailData', JSON.stringify(emailData))
    }
  }, [emailData, autoSave])

  const handleInputChange = (section: keyof EmailData, field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setEmailData(prev => ({
        ...prev,
        emailContent: {
          ...prev.emailContent,
          subject: `Application for ${prev.jobDetails.position} - ${prev.senderInfo.name}`,
          introduction: `I am writing to express my strong interest in the ${prev.jobDetails.position} position at ${prev.recipientInfo.company}. With my background and experience, I am confident in my ability to contribute effectively to your team.`,
          body: `Throughout my career, I have developed strong skills in leadership, problem-solving, and communication. I am particularly drawn to ${prev.recipientInfo.company} because of its reputation for innovation and excellence. I believe my experience aligns perfectly with the requirements of this role.`,
          conclusion: `I am excited about the opportunity to bring my skills and experience to ${prev.recipientInfo.company}. I would welcome the chance to discuss how I can contribute to your team's success. Thank you for considering my application.`
        }
      }))
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    const emailText = generateEmailText()
    navigator.clipboard.writeText(emailText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateEmailText = () => {
    return `Subject: ${emailData.emailContent.subject}

${emailData.emailContent.greeting}

${emailData.emailContent.introduction}

${emailData.emailContent.body}

${emailData.emailContent.conclusion}

${emailData.emailContent.signoff}
${emailData.senderInfo.name}
${emailData.senderInfo.email}
${emailData.senderInfo.phone}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Job Application Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create professional job application emails
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
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send Email
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
                  <div className="text-2xl mb-2">📧</div>
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
              {/* Sender Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Your Name"
                    value={emailData.senderInfo.name}
                    onChange={(e) => handleInputChange('senderInfo', 'name', e.target.value)}
                    placeholder="John Doe"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Email"
                      type="email"
                      value={emailData.senderInfo.email}
                      onChange={(e) => handleInputChange('senderInfo', 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    <Input
                      label="Phone (Optional)"
                      value={emailData.senderInfo.phone}
                      onChange={(e) => handleInputChange('senderInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Recipient Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Recipient Name"
                    value={emailData.recipientInfo.name}
                    onChange={(e) => handleInputChange('recipientInfo', 'name', e.target.value)}
                    placeholder="Jane Smith"
                  />
                  <Input
                    label="Recipient Email"
                    type="email"
                    value={emailData.recipientInfo.email}
                    onChange={(e) => handleInputChange('recipientInfo', 'email', e.target.value)}
                    placeholder="hiring@company.com"
                  />
                  <Input
                    label="Company"
                    value={emailData.recipientInfo.company}
                    onChange={(e) => handleInputChange('recipientInfo', 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Position Details
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Position Applied For"
                    value={emailData.jobDetails.position}
                    onChange={(e) => handleInputChange('jobDetails', 'position', e.target.value)}
                    placeholder="Software Engineer"
                  />
                  <Input
                    label="Job Reference (Optional)"
                    value={emailData.jobDetails.jobReference}
                    onChange={(e) => handleInputChange('jobDetails', 'jobReference', e.target.value)}
                    placeholder="REF-12345"
                  />
                </div>
              </div>

              {/* Email Content */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Content
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Subject Line"
                    value={emailData.emailContent.subject}
                    onChange={(e) => handleInputChange('emailContent', 'subject', e.target.value)}
                    placeholder="Application for [Position] - [Your Name]"
                  />
                  <Input
                    label="Greeting"
                    value={emailData.emailContent.greeting}
                    onChange={(e) => handleInputChange('emailContent', 'greeting', e.target.value)}
                    placeholder="Dear Hiring Manager,"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Introduction
                    </label>
                    <textarea
                      value={emailData.emailContent.introduction}
                      onChange={(e) => handleInputChange('emailContent', 'introduction', e.target.value)}
                      placeholder="I am writing to express my interest in..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Body
                    </label>
                    <textarea
                      value={emailData.emailContent.body}
                      onChange={(e) => handleInputChange('emailContent', 'body', e.target.value)}
                      placeholder="Describe your qualifications and experience..."
                      rows={5}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Conclusion
                    </label>
                    <textarea
                      value={emailData.emailContent.conclusion}
                      onChange={(e) => handleInputChange('emailContent', 'conclusion', e.target.value)}
                      placeholder="Thank you for considering my application..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Input
                    label="Sign-off"
                    value={emailData.emailContent.signoff}
                    onChange={(e) => handleInputChange('emailContent', 'signoff', e.target.value)}
                    placeholder="Best regards,"
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
                <h3 className="text-lg font-semibold">Email Preview</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg min-h-[600px] shadow-inner">
                <div className="text-sm md:text-base font-mono">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">To:</span> {emailData.recipientInfo.email || 'recipient@company.com'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">From:</span> {emailData.senderInfo.email || 'your@email.com'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Subject:</span> {emailData.emailContent.subject || 'Application for Position'}
                    </p>
                  </div>

                  <div className="space-y-4 whitespace-pre-line">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {emailData.emailContent.greeting}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      {emailData.emailContent.introduction || 'Your introduction will appear here...'}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      {emailData.emailContent.body || 'Your main content will appear here...'}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      {emailData.emailContent.conclusion || 'Your conclusion will appear here...'}
                    </p>

                    <div className="mt-8">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {emailData.emailContent.signoff}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {emailData.senderInfo.name || 'Your Name'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {emailData.senderInfo.email}
                      </p>
                      {emailData.senderInfo.phone && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {emailData.senderInfo.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
