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
  FileText,
  Calendar,
  Building2,
  CheckCircle
} from 'lucide-react'
import jsPDF from 'jspdf'

interface Deliverable {
  id: string
  title: string
  description: string
  quantity: string
  unitPrice: string
}

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  amount: string
}

interface ProposalData {
  proposalInfo: {
    title: string
    proposalNumber: string
    date: string
    validUntil: string
  }
  senderInfo: {
    name: string
    company: string
    email: string
    phone: string
    address: string
  }
  clientInfo: {
    name: string
    company: string
    email: string
    phone: string
    address: string
  }
  projectDetails: {
    projectName: string
    description: string
    startDate: string
    endDate: string
  }
  deliverables: Deliverable[]
  milestones: Milestone[]
  terms: {
    paymentTerms: string
    validity: string
    additionalTerms: string
  }
}

const templates = [
  { id: 'standard', name: 'Standard', description: 'Professional business proposal' },
  { id: 'detailed', name: 'Detailed', description: 'Comprehensive breakdown' },
  { id: 'simple', name: 'Simple', description: 'Concise and direct' },
  { id: 'creative', name: 'Creative', description: 'Modern design' },
]

export function BusinessProposalBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [proposalData, setProposalData] = useState<ProposalData>({
    proposalInfo: {
      title: '',
      proposalNumber: '',
      date: new Date().toISOString().split('T')[0],
      validUntil: ''
    },
    senderInfo: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    },
    clientInfo: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: ''
    },
    projectDetails: {
      projectName: '',
      description: '',
      startDate: '',
      endDate: ''
    },
    deliverables: [],
    milestones: [],
    terms: {
      paymentTerms: '',
      validity: '',
      additionalTerms: ''
    }
  })

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('proposalData', JSON.stringify(proposalData))
    }
  }, [proposalData, autoSave])

  const handleInputChange = (section: keyof ProposalData, field: string, value: string) => {
    setProposalData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: Date.now().toString(),
      title: '',
      description: '',
      quantity: '1',
      unitPrice: '0'
    }
    setProposalData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, newDeliverable]
    }))
  }

  const updateDeliverable = (id: string, field: keyof Deliverable, value: string) => {
    setProposalData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(d => 
        d.id === id ? { ...d, [field]: value } : d
      )
    }))
  }

  const deleteDeliverable = (id: string) => {
    setProposalData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(d => d.id !== id)
    }))
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      dueDate: '',
      amount: '0'
    }
    setProposalData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setProposalData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }))
  }

  const deleteMilestone = (id: string) => {
    setProposalData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const calculateTotal = () => {
    return proposalData.deliverables.reduce((total, d) => {
      return total + (parseFloat(d.quantity) * parseFloat(d.unitPrice))
    }, 0)
  }

  const generateWithAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setProposalData(prev => ({
        ...prev,
        projectDetails: {
          ...prev.projectDetails,
          description: 'This project aims to deliver a comprehensive solution that addresses your business needs. Our team will work closely with you to ensure all requirements are met with the highest quality standards.'
        },
        terms: {
          ...prev.terms,
          paymentTerms: '50% upfront, 50% upon completion',
          validity: 'This proposal is valid for 30 days from the date of issue'
        }
      }))
      setIsGenerating(false)
    }, 2000)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(24)
    doc.text(proposalData.proposalInfo.title || 'Business Proposal', 20, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.text(`Proposal #: ${proposalData.proposalInfo.proposalNumber || 'N/A'}`, 20, yPosition)
    yPosition += 7
    doc.text(`Date: ${proposalData.proposalInfo.date}`, 20, yPosition)
    yPosition += 7
    doc.text(`Valid Until: ${proposalData.proposalInfo.validUntil || 'N/A'}`, 20, yPosition)
    yPosition += 20

    doc.setFontSize(14)
    doc.text('Project Details', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(`Project: ${proposalData.projectDetails.projectName || 'N/A'}`, 20, yPosition)
    yPosition += 7
    const descriptionLines = doc.splitTextToSize(proposalData.projectDetails.description, 170)
    doc.text(descriptionLines, 20, yPosition)
    yPosition += descriptionLines.length * 7 + 15

    doc.setFontSize(14)
    doc.text('Deliverables', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    proposalData.deliverables.forEach((d, index) => {
      doc.text(`${index + 1}. ${d.title} - $${d.unitPrice} x ${d.quantity}`, 20, yPosition)
      yPosition += 7
    })

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 20, yPosition)

    doc.save('business-proposal.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Business Proposal Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create professional business proposals
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
              {/* Proposal Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Proposal Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Proposal Title"
                    value={proposalData.proposalInfo.title}
                    onChange={(e) => handleInputChange('proposalInfo', 'title', e.target.value)}
                    placeholder="Website Development Proposal"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Proposal Number"
                      value={proposalData.proposalInfo.proposalNumber}
                      onChange={(e) => handleInputChange('proposalInfo', 'proposalNumber', e.target.value)}
                      placeholder="PROP-001"
                    />
                    <Input
                      label="Date"
                      type="date"
                      value={proposalData.proposalInfo.date}
                      onChange={(e) => handleInputChange('proposalInfo', 'date', e.target.value)}
                    />
                    <Input
                      label="Valid Until"
                      type="date"
                      value={proposalData.proposalInfo.validUntil}
                      onChange={(e) => handleInputChange('proposalInfo', 'validUntil', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sender Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Your Information
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      value={proposalData.senderInfo.name}
                      onChange={(e) => handleInputChange('senderInfo', 'name', e.target.value)}
                      placeholder="John Doe"
                    />
                    <Input
                      label="Company"
                      value={proposalData.senderInfo.company}
                      onChange={(e) => handleInputChange('senderInfo', 'company', e.target.value)}
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={proposalData.senderInfo.email}
                      onChange={(e) => handleInputChange('senderInfo', 'email', e.target.value)}
                      placeholder="john@company.com"
                    />
                    <Input
                      label="Phone"
                      value={proposalData.senderInfo.phone}
                      onChange={(e) => handleInputChange('senderInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Input
                    label="Address"
                    value={proposalData.senderInfo.address}
                    onChange={(e) => handleInputChange('senderInfo', 'address', e.target.value)}
                    placeholder="123 Business Ave, City"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h4 className="font-semibold mb-4">Client Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Client Name"
                      value={proposalData.clientInfo.name}
                      onChange={(e) => handleInputChange('clientInfo', 'name', e.target.value)}
                      placeholder="Jane Smith"
                    />
                    <Input
                      label="Client Company"
                      value={proposalData.clientInfo.company}
                      onChange={(e) => handleInputChange('clientInfo', 'company', e.target.value)}
                      placeholder="Client Company"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={proposalData.clientInfo.email}
                      onChange={(e) => handleInputChange('clientInfo', 'email', e.target.value)}
                      placeholder="jane@client.com"
                    />
                    <Input
                      label="Phone"
                      value={proposalData.clientInfo.phone}
                      onChange={(e) => handleInputChange('clientInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Input
                    label="Address"
                    value={proposalData.clientInfo.address}
                    onChange={(e) => handleInputChange('clientInfo', 'address', e.target.value)}
                    placeholder="456 Client St, City"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Project Details
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Project Name"
                    value={proposalData.projectDetails.projectName}
                    onChange={(e) => handleInputChange('projectDetails', 'projectName', e.target.value)}
                    placeholder="Website Redesign"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={proposalData.projectDetails.description}
                      onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
                      placeholder="Describe the project..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={proposalData.projectDetails.startDate}
                      onChange={(e) => handleInputChange('projectDetails', 'startDate', e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={proposalData.projectDetails.endDate}
                      onChange={(e) => handleInputChange('projectDetails', 'endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Deliverables
                </h4>
                <div className="space-y-4">
                  {proposalData.deliverables.map((deliverable) => (
                    <Card key={deliverable.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase text-gray-500">Deliverable</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDeliverable(deliverable.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          label="Title"
                          value={deliverable.title}
                          onChange={(e) => updateDeliverable(deliverable.id, 'title', e.target.value)}
                          placeholder="Deliverable name"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={deliverable.description}
                            onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                            placeholder="Deliverable description..."
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Quantity"
                            type="number"
                            value={deliverable.quantity}
                            onChange={(e) => updateDeliverable(deliverable.id, 'quantity', e.target.value)}
                            placeholder="1"
                          />
                          <Input
                            label="Unit Price"
                            type="number"
                            value={deliverable.unitPrice}
                            onChange={(e) => updateDeliverable(deliverable.id, 'unitPrice', e.target.value)}
                            placeholder="1000"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addDeliverable} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Deliverable
                  </Button>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Payment Milestones
                </h4>
                <div className="space-y-4">
                  {proposalData.milestones.map((milestone) => (
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
                        <Input
                          label="Title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          placeholder="Milestone name"
                        />
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
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Due Date"
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                          />
                          <Input
                            label="Amount"
                            type="number"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                            placeholder="5000"
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

              {/* Terms */}
              <div>
                <h4 className="font-semibold mb-4">Terms & Conditions</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Terms
                    </label>
                    <textarea
                      value={proposalData.terms.paymentTerms}
                      onChange={(e) => handleInputChange('terms', 'paymentTerms', e.target.value)}
                      placeholder="Payment terms..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validity
                    </label>
                    <textarea
                      value={proposalData.terms.validity}
                      onChange={(e) => handleInputChange('terms', 'validity', e.target.value)}
                      placeholder="Proposal validity..."
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Terms
                    </label>
                    <textarea
                      value={proposalData.terms.additionalTerms}
                      onChange={(e) => handleInputChange('terms', 'additionalTerms', e.target.value)}
                      placeholder="Additional terms..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
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
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg min-h-[600px] shadow-inner">
                {/* Header */}
                <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {proposalData.proposalInfo.title || 'Business Proposal'}
                  </h1>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-semibold">Proposal #:</span> {proposalData.proposalInfo.proposalNumber || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span> {proposalData.proposalInfo.date}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Valid Until:</span> {proposalData.proposalInfo.validUntil || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Parties */}
                <div className="mb-8 grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prepared For</h3>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.clientInfo.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.clientInfo.company}</p>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.clientInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prepared By</h3>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.senderInfo.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.senderInfo.company}</p>
                    <p className="text-gray-600 dark:text-gray-400">{proposalData.senderInfo.email}</p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    {proposalData.projectDetails.projectName || 'Project Name'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {proposalData.projectDetails.description || 'Project description...'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Start Date:</span> {proposalData.projectDetails.startDate || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">End Date:</span> {proposalData.projectDetails.endDate || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                {proposalData.deliverables.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deliverables</h3>
                    <div className="space-y-3">
                      {proposalData.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{deliverable.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{deliverable.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              ${parseFloat(deliverable.unitPrice).toFixed(2)} x {deliverable.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <div className="text-2xl font-bold text-primary">
                        Total: ${calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {proposalData.milestones.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Milestones</h3>
                    <div className="space-y-3">
                      {proposalData.milestones.map((milestone) => (
                        <div key={milestone.id} className="border-l-4 border-primary pl-4">
                          <div className="font-semibold text-gray-900 dark:text-white">{milestone.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Due: {milestone.dueDate} | Amount: ${parseFloat(milestone.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p><strong>Payment Terms:</strong> {proposalData.terms.paymentTerms || 'N/A'}</p>
                  <p><strong>Validity:</strong> {proposalData.terms.validity || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
