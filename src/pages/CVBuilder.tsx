import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Download, 
  Printer, 
  Share2, 
  Save, 
  Eye, 
  Upload, 
  Plus, 
  Trash2, 
  FileText,
  Target
} from 'lucide-react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    photo: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  languages: Array<{
    language: string
    proficiency: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
  }>
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'corporate', name: 'Corporate', description: 'Professional business style' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'creative', name: 'Creative', description: 'Stand out from the crowd' },
  { id: 'executive', name: 'Executive', description: 'Senior leadership focused' },
]

export function CVBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [autoSave, setAutoSave] = useState(true)
  const [atsScore, setAtsScore] = useState(85)
  const [resumeScore, setResumeScore] = useState(78)
  const [qrCode, setQrCode] = useState('')

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: []
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('cvData', JSON.stringify(cvData))
    }
  }, [cvData, autoSave])

  useEffect(() => {
    const saved = localStorage.getItem('cvData')
    if (saved) {
      setCvData(JSON.parse(saved))
    }
  }, [])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCvData({
          ...cvData,
          personalInfo: {
            ...cvData.personalInfo,
            photo: reader.result as string
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    })
  }

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    })
  }

  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [
        ...cvData.languages,
        {
          language: '',
          proficiency: ''
        }
      ]
    })
  }

  const addCertification = () => {
    setCvData({
      ...cvData,
      certifications: [
        ...cvData.certifications,
        {
          id: Date.now().toString(),
          name: '',
          issuer: '',
          date: ''
        }
      ]
    })
  }

  const addSkill = () => {
    const skill = prompt('Enter a skill:')
    if (skill) {
      setCvData({
        ...cvData,
        skills: [...cvData.skills, skill]
      })
    }
  }

  const removeSkill = (index: number) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== index)
    })
  }

  const downloadPDF = () => {
    const element = document.getElementById('cv-preview-content')
    if (!element) return
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Add content to PDF
    let yPosition = 20
    
    // Header
    pdf.setFontSize(24)
    pdf.setTextColor(0, 0, 0)
    pdf.text(cvData.personalInfo.fullName || 'Your Name', 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(11)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`${cvData.personalInfo.email} • ${cvData.personalInfo.phone}`, 20, yPosition)
    yPosition += 7
    pdf.text(cvData.personalInfo.location, 20, yPosition)
    yPosition += 7
    
    if (cvData.personalInfo.linkedin || cvData.personalInfo.website) {
      const links = [cvData.personalInfo.linkedin, cvData.personalInfo.website].filter(Boolean).join(' • ')
      pdf.text(links, 20, yPosition)
      yPosition += 7
    }
    
    yPosition += 10
    
    // Summary
    if (cvData.personalInfo.summary) {
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Professional Summary', 20, yPosition)
      yPosition += 7
      pdf.setFontSize(10)
      pdf.setTextColor(60, 60, 60)
      const summaryLines = pdf.splitTextToSize(cvData.personalInfo.summary, 170)
      pdf.text(summaryLines, 20, yPosition)
      yPosition += summaryLines.length * 5 + 10
    }
    
    // Experience
    if (cvData.experience.length > 0) {
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Work Experience', 20, yPosition)
      yPosition += 7
      
      cvData.experience.forEach((exp) => {
        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`${exp.position} at ${exp.company}`, 20, yPosition)
        yPosition += 5
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 20, yPosition)
        yPosition += 5
        if (exp.description) {
          pdf.setFontSize(10)
          pdf.setTextColor(60, 60, 60)
          const descLines = pdf.splitTextToSize(exp.description, 170)
          pdf.text(descLines, 20, yPosition)
          yPosition += descLines.length * 5 + 5
        }
        yPosition += 5
      })
    }
    
    // Education
    if (cvData.education.length > 0) {
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Education', 20, yPosition)
      yPosition += 7
      
      cvData.education.forEach((edu) => {
        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`${edu.degree} in ${edu.field}`, 20, yPosition)
        yPosition += 5
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`${edu.school} • ${edu.startDate} - ${edu.endDate}`, 20, yPosition)
        yPosition += 5
        if (edu.description) {
          pdf.setFontSize(10)
          pdf.setTextColor(60, 60, 60)
          const descLines = pdf.splitTextToSize(edu.description, 170)
          pdf.text(descLines, 20, yPosition)
          yPosition += descLines.length * 5 + 5
        }
        yPosition += 5
      })
    }
    
    // Skills
    if (cvData.skills.length > 0) {
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Skills', 20, yPosition)
      yPosition += 7
      pdf.setFontSize(10)
      pdf.setTextColor(60, 60, 60)
      pdf.text(cvData.skills.join(', '), 20, yPosition)
    }
    
    pdf.save('my-cv.pdf')
  }

  const printCV = () => {
    const element = document.getElementById('cv-preview-content')
    if (element) {
      const printWindow = window.open('', '', 'height=600,width=800')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print CV</title>')
        printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;}</style>')
        printWindow.document.write('</head><body>')
        printWindow.document.write(element.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const generateQRCode = async () => {
    try {
      const url = `https://hawaiinelevation.com/cv/${Date.now()}`
      const qr = await QRCode.toDataURL(url)
      setQrCode(qr)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const calculateScores = () => {
    // Simple scoring logic
    let ats = 50
    let resume = 50

    if (cvData.personalInfo.fullName) ats += 10
    if (cvData.personalInfo.email) ats += 10
    if (cvData.personalInfo.phone) ats += 10
    if (cvData.personalInfo.summary) ats += 10
    if (cvData.experience.length > 0) ats += 10

    if (cvData.personalInfo.summary.length > 100) resume += 15
    if (cvData.experience.length >= 2) resume += 15
    if (cvData.education.length >= 1) resume += 10
    if (cvData.skills.length >= 5) resume += 10

    setAtsScore(ats)
    setResumeScore(resume)
  }

  useEffect(() => {
    calculateScores()
  }, [cvData])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              CV Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your professional resume
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
            <Button variant="outline" size="sm" onClick={generateQRCode}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={printCV}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button size="sm" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  <span className="font-semibold">ATS Score</span>
                </div>
                <Badge variant={atsScore >= 80 ? 'success' : atsScore >= 60 ? 'warning' : 'danger'}>
                  {atsScore}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {atsScore >= 80 ? 'Excellent! Your CV is ATS-friendly.' : 
                 atsScore >= 60 ? 'Good. Add more keywords to improve.' : 
                 'Needs improvement. Add more details.'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary mr-2" />
                  <span className="font-semibold">Resume Score</span>
                </div>
                <Badge variant={resumeScore >= 80 ? 'success' : resumeScore >= 60 ? 'warning' : 'danger'}>
                  {resumeScore}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {resumeScore >= 80 ? 'Great! Your resume looks professional.' : 
                 resumeScore >= 60 ? 'Good. Add more achievements.' : 
                 'Needs work. Expand your sections.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Template Selection */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Choose Template</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  <div className="text-2xl mb-2">📄</div>
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
                <h4 className="font-semibold mb-4">Personal Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {cvData.personalInfo.photo ? (
                      <img
                        src={cvData.personalInfo.photo}
                        alt="Profile"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button variant="outline" size="sm">
                          Upload Photo
                        </Button>
                      </label>
                    </div>
                  </div>
                  <Input
                    label="Full Name"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                    })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, email: e.target.value }
                    })}
                  />
                  <Input
                    label="Phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                    })}
                  />
                  <Input
                    label="Location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, location: e.target.value }
                    })}
                  />
                  <Input
                    label="LinkedIn"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }
                    })}
                  />
                  <Input
                    label="Website"
                    value={cvData.personalInfo.website}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, website: e.target.value }
                    })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      value={cvData.personalInfo.summary}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, summary: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Work Experience</h4>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {cvData.experience.map((exp, index) => (
                  <Card key={exp.id} className="mb-4">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...cvData.experience]
                          newExp[index].company = e.target.value
                          setCvData({ ...cvData, experience: newExp })
                        }}
                      />
                      <Input
                        label="Position"
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...cvData.experience]
                          newExp[index].position = e.target.value
                          setCvData({ ...cvData, experience: newExp })
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...cvData.experience]
                            newExp[index].startDate = e.target.value
                            setCvData({ ...cvData, experience: newExp })
                          }}
                        />
                        <div>
                          <Input
                            label="End Date"
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => {
                              const newExp = [...cvData.experience]
                              newExp[index].endDate = e.target.value
                              setCvData({ ...cvData, experience: newExp })
                            }}
                            disabled={exp.current}
                          />
                          <label className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                const newExp = [...cvData.experience]
                                newExp[index].current = e.target.checked
                                if (e.target.checked) {
                                  newExp[index].endDate = ''
                                }
                                setCvData({ ...cvData, experience: newExp })
                              }}
                              className="mr-2"
                            />
                            Currently working here
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...cvData.experience]
                            newExp[index].description = e.target.value
                            setCvData({ ...cvData, experience: newExp })
                          }}
                        />
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setCvData({
                            ...cvData,
                            experience: cvData.experience.filter((_, i) => i !== index)
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Skills</h4>
                  <Button variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="default" className="flex items-center">
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Education</h4>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Card key={edu.id} className="mb-4">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        label="School"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...cvData.education]
                          newEdu[index].school = e.target.value
                          setCvData({ ...cvData, education: newEdu })
                        }}
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...cvData.education]
                          newEdu[index].degree = e.target.value
                          setCvData({ ...cvData, education: newEdu })
                        }}
                      />
                      <Input
                        label="Field of Study"
                        value={edu.field}
                        onChange={(e) => {
                          const newEdu = [...cvData.education]
                          newEdu[index].field = e.target.value
                          setCvData({ ...cvData, education: newEdu })
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => {
                            const newEdu = [...cvData.education]
                            newEdu[index].startDate = e.target.value
                            setCvData({ ...cvData, education: newEdu })
                          }}
                        />
                        <Input
                          label="End Date"
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => {
                            const newEdu = [...cvData.education]
                            newEdu[index].endDate = e.target.value
                            setCvData({ ...cvData, education: newEdu })
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={2}
                          value={edu.description}
                          onChange={(e) => {
                            const newEdu = [...cvData.education]
                            newEdu[index].description = e.target.value
                            setCvData({ ...cvData, education: newEdu })
                          }}
                        />
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setCvData({
                            ...cvData,
                            education: cvData.education.filter((_, i) => i !== index)
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Languages</h4>
                  <Button variant="outline" size="sm" onClick={addLanguage}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {cvData.languages.map((lang, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        label="Language"
                        value={lang.language}
                        onChange={(e) => {
                          const newLangs = [...cvData.languages]
                          newLangs[index].language = e.target.value
                          setCvData({ ...cvData, languages: newLangs })
                        }}
                      />
                      <Input
                        label="Proficiency"
                        value={lang.proficiency}
                        onChange={(e) => {
                          const newLangs = [...cvData.languages]
                          newLangs[index].proficiency = e.target.value
                          setCvData({ ...cvData, languages: newLangs })
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setCvData({
                            ...cvData,
                            languages: cvData.languages.filter((_, i) => i !== index)
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Certifications</h4>
                  <Button variant="outline" size="sm" onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {cvData.certifications.map((cert, index) => (
                  <Card key={cert.id} className="mb-4">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        label="Certification Name"
                        value={cert.name}
                        onChange={(e) => {
                          const newCerts = [...cvData.certifications]
                          newCerts[index].name = e.target.value
                          setCvData({ ...cvData, certifications: newCerts })
                        }}
                      />
                      <Input
                        label="Issuer"
                        value={cert.issuer}
                        onChange={(e) => {
                          const newCerts = [...cvData.certifications]
                          newCerts[index].issuer = e.target.value
                          setCvData({ ...cvData, certifications: newCerts })
                        }}
                      />
                      <Input
                        label="Date"
                        type="date"
                        value={cert.date}
                        onChange={(e) => {
                          const newCerts = [...cvData.certifications]
                          newCerts[index].date = e.target.value
                          setCvData({ ...cvData, certifications: newCerts })
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setCvData({
                            ...cvData,
                            certifications: cvData.certifications.filter((_, i) => i !== index)
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Full Screen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div id="cv-preview-content" className={`bg-white dark:bg-gray-800 p-8 rounded-lg min-h-[600px] ${
                selectedTemplate === 'modern' ? 'modern-template' :
                selectedTemplate === 'corporate' ? 'corporate-template' :
                selectedTemplate === 'minimal' ? 'minimal-template' :
                selectedTemplate === 'creative' ? 'creative-template' :
                selectedTemplate === 'executive' ? 'executive-template' : ''
              }`}>
                {/* Modern Template - Centered Header */}
                {selectedTemplate === 'modern' && (
                  <>
                    <div className="text-center mb-6">
                      {cvData.personalInfo.photo && (
                        <img
                          src={cvData.personalInfo.photo}
                          alt="Profile"
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
                        />
                      )}
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {cvData.personalInfo.fullName || 'Your Name'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cvData.personalInfo.email} • {cvData.personalInfo.phone}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cvData.personalInfo.location}
                      </p>
                      {(cvData.personalInfo.linkedin || cvData.personalInfo.website) && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
                          {cvData.personalInfo.linkedin && cvData.personalInfo.website && <span> • </span>}
                          {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
                        </p>
                      )}
                    </div>

                    {cvData.personalInfo.summary && (
                      <div className="mb-6 text-center">
                        <h3 className="text-lg font-semibold mb-2 text-primary">Professional Summary</h3>
                        <p className="text-gray-700 dark:text-gray-300">{cvData.personalInfo.summary}</p>
                      </div>
                    )}

                    {cvData.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary border-b-2 border-primary pb-1">Work Experience</h3>
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="mb-4">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{exp.position}</h4>
                              <span className="text-sm text-gray-500">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary border-b-2 border-primary pb-1">Education</h3>
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="mb-4">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                              <span className="text-sm text-gray-500">
                                {edu.startDate} - {edu.endDate}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                            {edu.description && (
                              <p className="text-gray-700 dark:text-gray-300 mt-1">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary border-b-2 border-primary pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.map((skill, index) => (
                            <Badge key={index} variant="default" className="bg-primary text-white">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.languages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary border-b-2 border-primary pb-1">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.languages.map((lang, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                              {lang.language} ({lang.proficiency})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary border-b-2 border-primary pb-1">Certifications</h3>
                        {cvData.certifications.map((cert) => (
                          <div key={cert.id} className="mb-2">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{cert.name}</h4>
                              <span className="text-sm text-gray-500">{cert.date}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Corporate Template - Left Aligned with Sidebar */}
                {selectedTemplate === 'corporate' && (
                  <>
                    <div className="flex gap-6">
                      <div className="w-1/3 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                        {cvData.personalInfo.photo && (
                          <img
                            src={cvData.personalInfo.photo}
                            alt="Profile"
                            className="w-full aspect-square object-cover rounded mb-4"
                          />
                        )}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {cvData.personalInfo.fullName || 'Your Name'}
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>{cvData.personalInfo.email}</p>
                          <p>{cvData.personalInfo.phone}</p>
                          <p>{cvData.personalInfo.location}</p>
                          {cvData.personalInfo.linkedin && <p>{cvData.personalInfo.linkedin}</p>}
                          {cvData.personalInfo.website && <p>{cvData.personalInfo.website}</p>}
                        </div>

                        {cvData.skills.length > 0 && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {cvData.skills.map((skill, index) => (
                                <li key={index}>• {skill}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {cvData.languages.length > 0 && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {cvData.languages.map((lang, index) => (
                                <li key={index}>• {lang.language} ({lang.proficiency})</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="w-2/3">
                        {cvData.personalInfo.summary && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">Professional Summary</h3>
                            <p className="text-gray-700 dark:text-gray-300">{cvData.personalInfo.summary}</p>
                          </div>
                        )}

                        {cvData.experience.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">Work Experience</h3>
                            {cvData.experience.map((exp) => (
                              <div key={exp.id} className="mb-4">
                                <div className="flex justify-between">
                                  <h4 className="font-semibold">{exp.position}</h4>
                                  <span className="text-sm text-gray-500">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                                <p className="text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {cvData.education.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">Education</h3>
                            {cvData.education.map((edu) => (
                              <div key={edu.id} className="mb-4">
                                <div className="flex justify-between">
                                  <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                                  <span className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">{edu.school}</p>
                                {edu.description && (
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {cvData.certifications.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">Certifications</h3>
                            {cvData.certifications.map((cert) => (
                              <div key={cert.id} className="mb-2">
                                <div className="flex justify-between">
                                  <h4 className="font-semibold">{cert.name}</h4>
                                  <span className="text-sm text-gray-500">{cert.date}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Minimal Template - Clean and Simple */}
                {selectedTemplate === 'minimal' && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
                        {cvData.personalInfo.fullName || 'Your Name'}
                      </h2>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p>{cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}</p>
                        {(cvData.personalInfo.linkedin || cvData.personalInfo.website) && (
                          <p>
                            {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
                            {cvData.personalInfo.linkedin && cvData.personalInfo.website && <span> | </span>}
                            {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
                          </p>
                        )}
                      </div>
                    </div>

                    {cvData.personalInfo.summary && (
                      <div className="mb-8">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{cvData.personalInfo.summary}</p>
                      </div>
                    )}

                    {cvData.experience.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Experience</h3>
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                              <span className="text-xs text-gray-500">
                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.company}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.education.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Education</h3>
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree} in {edu.field}</h4>
                              <span className="text-xs text-gray-500">
                                {edu.startDate} – {edu.endDate}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.skills.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Skills</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{cvData.skills.join(' • ')}</p>
                      </div>
                    )}

                    {cvData.languages.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Languages</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {cvData.languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
                        </p>
                      </div>
                    )}

                    {cvData.certifications.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Certifications</h3>
                        {cvData.certifications.map((cert) => (
                          <div key={cert.id} className="mb-2">
                            <p className="text-sm text-gray-900 dark:text-white">{cert.name} – {cert.issuer} ({cert.date})</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Creative Template - Colorful and Unique */}
                {selectedTemplate === 'creative' && (
                  <>
                    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 -mx-8 -mt-8 mb-6">
                      <div className="flex items-center gap-4">
                        {cvData.personalInfo.photo && (
                          <img
                            src={cvData.personalInfo.photo}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white"
                          />
                        )}
                        <div>
                          <h2 className="text-2xl font-bold">
                            {cvData.personalInfo.fullName || 'Your Name'}
                          </h2>
                          <p className="text-white/80 text-sm">
                            {cvData.personalInfo.email} • {cvData.personalInfo.phone}
                          </p>
                          <p className="text-white/80 text-sm">
                            {cvData.personalInfo.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {cvData.personalInfo.summary && (
                      <div className="mb-6 bg-primary/5 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-primary">About Me</h3>
                        <p className="text-gray-700 dark:text-gray-300">{cvData.personalInfo.summary}</p>
                      </div>
                    )}

                    {cvData.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                          <span className="w-8 h-1 bg-primary"></span>
                          Work Experience
                        </h3>
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="mb-4 pl-4 border-l-2 border-primary">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-500 mb-2">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                          <span className="w-8 h-1 bg-primary"></span>
                          Education
                        </h3>
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="mb-4 pl-4 border-l-2 border-primary">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree} in {edu.field}</h4>
                            <p className="text-primary font-medium">{edu.school}</p>
                            <p className="text-sm text-gray-500">
                              {edu.startDate} - {edu.endDate}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                          <span className="w-8 h-1 bg-primary"></span>
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.map((skill, index) => (
                            <span key={index} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.languages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                          <span className="w-8 h-1 bg-primary"></span>
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.languages.map((lang, index) => (
                            <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                              {lang.language} ({lang.proficiency})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                          <span className="w-8 h-1 bg-primary"></span>
                          Certifications
                        </h3>
                        {cvData.certifications.map((cert) => (
                          <div key={cert.id} className="mb-2 pl-4 border-l-2 border-primary">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{cert.issuer} • {cert.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Executive Template - Professional and Formal */}
                {selectedTemplate === 'executive' && (
                  <>
                    <div className="border-b-4 border-gray-900 dark:border-white pb-6 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                            {cvData.personalInfo.fullName || 'Your Name'}
                          </h2>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p className="font-medium">{cvData.personalInfo.email}</p>
                            <p>{cvData.personalInfo.phone}</p>
                            <p>{cvData.personalInfo.location}</p>
                            {cvData.personalInfo.linkedin && <p>{cvData.personalInfo.linkedin}</p>}
                            {cvData.personalInfo.website && <p>{cvData.personalInfo.website}</p>}
                          </div>
                        </div>
                        {cvData.personalInfo.photo && (
                          <img
                            src={cvData.personalInfo.photo}
                            alt="Profile"
                            className="w-24 h-24 object-cover border-2 border-gray-900 dark:border-white"
                          />
                        )}
                      </div>
                    </div>

                    {cvData.personalInfo.summary && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">Executive Summary</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{cvData.personalInfo.summary}</p>
                      </div>
                    )}

                    {cvData.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Professional Experience</h3>
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white uppercase">{exp.position}</h4>
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase">{exp.company}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Education</h3>
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white uppercase">{edu.degree}</h4>
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {edu.startDate} – {edu.endDate}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{edu.field}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Core Competencies</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                          {cvData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-900 dark:bg-white mr-2"></span>
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Certifications & Awards</h3>
                        {cvData.certifications.map((cert) => (
                          <div key={cert.id} className="mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer} – {cert.date}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvData.languages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Languages</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {cvData.languages.map(l => `${l.language} - ${l.proficiency}`).join(' | ')}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {qrCode && (
                  <div className="mt-6 flex justify-center">
                    <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
