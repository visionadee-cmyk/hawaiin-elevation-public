import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Lock, FileText, Receipt, CheckCircle, Share2, Download, Plus, Building2, LogOut, Trash2, Package, Edit } from 'lucide-react'
import jsPDF from 'jspdf'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

const ADMIN_PASSWORD = 'Adhu1447'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Quotation {
  id: string
  number: string
  date: string
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  items: LineItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  quotationId?: string
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  items: LineItem[]
  subtotal: number
  tax: number
  total: number
  paidAmount: number
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue'
  notes: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: string
  features: string[]
  popular: boolean
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotations' | 'invoices' | 'company' | 'services'>('dashboard')
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Hawaiin Elevation PLC',
    logo: '/logo.jpeg',
    address: '',
    gstNumber: '',
    registryStamp: '/stamp.png',
    phone: '',
    email: '',
    signature: '/Abobakuru e signature.jpeg'
  })
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [showNewQuotation, setShowNewQuotation] = useState(false)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [showNewService, setShowNewService] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [newQuotation, setNewQuotation] = useState<Quotation>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], clientName: '', clientAddress: '',
    clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0, notes: '', status: 'draft'
  })

  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], dueDate: '', clientName: '',
    clientAddress: '', clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0,
    paidAmount: 0, notes: '', status: 'draft'
  })

  const [newService, setNewService] = useState<Service>({
    id: '', name: '', description: '', price: 0, currency: 'MVR', period: 'one-time', features: [], popular: false
  })

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    loadData()
  }, [])

  const loadData = async () => {
    const savedCompany = localStorage.getItem('companyInfo')
    if (savedCompany) setCompanyInfo(JSON.parse(savedCompany))

    const savedQuotations = localStorage.getItem('quotations')
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations) as Quotation[])

    const savedInvoices = localStorage.getItem('invoices')
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices) as Invoice[])

    // Load services from Firebase
    try {
      const servicesQuery = query(collection(db, 'services'), orderBy('name'))
      const servicesSnapshot = await getDocs(servicesQuery)
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[]
      
      if (servicesData.length > 0) {
        setServices(servicesData)
      } else {
        // Pre-populate with HRMS services if none exist
        await initializeDefaultServices()
      }
    } catch (error) {
      console.error('Error loading services from Firebase:', error)
      // Fallback to localStorage
      const savedServices = localStorage.getItem('services')
      if (savedServices) {
        setServices(JSON.parse(savedServices) as Service[])
      } else {
        await initializeDefaultServices()
      }
    }
  }

  const initializeDefaultServices = async () => {
    const initialServices: Service[] = [
      {
        id: 'hrms-starter',
        name: 'HRMS Starter',
        description: 'Perfect for small organizations',
        price: 10000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Up to 25 employees',
          'Basic employee management',
          'Attendance tracking',
          'Leave management',
          'Basic reports',
          'Email support',
          '5GB storage',
          '3 months post-sales customization'
        ]
      },
      {
        id: 'hrms-professional',
        name: 'HRMS Professional',
        description: 'Ideal for growing organizations',
        price: 20000,
        currency: 'MVR',
        period: 'one-time',
        popular: true,
        features: [
          'Up to 100 employees',
          'Full employee management',
          'Attendance with biometric sync',
          'Leave & overtime management',
          'Payroll processing',
          'Advanced reports & analytics',
          'Expatriate management',
          'Driving licence tracking',
          'Council assets management',
          'Priority email support',
          '25GB storage',
          'Mobile app access',
          '6 months post-sales customization'
        ]
      },
      {
        id: 'hrms-enterprise',
        name: 'HRMS Enterprise',
        description: 'For large organizations',
        price: 30000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Unlimited employees',
          'Complete HRMS suite',
          'Multi-location support',
          'Advanced biometric integration',
          'Custom workflows',
          'API access',
          'White-label solution',
          'Dedicated account manager',
          '24/7 phone support',
          'Unlimited storage',
          'On-premise deployment option',
          'Custom integrations',
          'Training & onboarding',
          'SLA guarantee',
          '1 year post-sales customization'
        ]
      },
      {
        id: 'cv-builder',
        name: 'CV Builder',
        description: 'Professional CV creation with multiple templates',
        price: 500,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Multiple professional templates',
          'AI-powered content suggestions',
          'PDF export',
          'Print-ready format',
          'Custom sections',
          'Real-time preview',
          'Mobile responsive'
        ]
      },
      {
        id: 'cover-letter',
        name: 'Cover Letter Builder',
        description: 'AI-powered cover letter generation',
        price: 300,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'AI-powered generation',
          'Multiple templates',
          'Customizable tone',
          'PDF export',
          'CV upload integration',
          'Real-time preview'
        ]
      },
      {
        id: 'portfolio-builder',
        name: 'Portfolio Builder',
        description: 'Create stunning online portfolios',
        price: 750,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Modern templates',
          'Drag & drop builder',
          'Custom domains',
          'SEO optimization',
          'Analytics dashboard',
          'Image gallery',
          'Contact forms'
        ]
      },
      {
        id: 'personal-website',
        name: 'Personal Website Builder',
        description: 'Build your personal brand online',
        price: 1500,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Professional templates',
          'Blog integration',
          'Social media links',
          'Contact forms',
          'SEO tools',
          'Custom branding',
          'Mobile responsive'
        ]
      },
      {
        id: 'company-website',
        name: 'Company Website Builder',
        description: 'Professional business websites',
        price: 3000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Business templates',
          'E-commerce ready',
          'Team pages',
          'Testimonials',
          'Service showcase',
          'Contact management',
          'Analytics integration'
        ]
      },
      {
        id: 'company-profile',
        name: 'Company Profile Builder',
        description: 'Create professional company profiles',
        price: 2000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Professional layouts',
          'Company history',
          'Team showcase',
          'Achievements',
          'PDF export',
          'Print-ready',
          'Custom branding'
        ]
      },
      {
        id: 'business-proposal',
        name: 'Business Proposal Builder',
        description: 'Win more clients with professional proposals',
        price: 1000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Proposal templates',
          'Pricing tables',
          'Contract integration',
          'Digital signatures',
          'PDF export',
          'Client management',
          'Tracking analytics'
        ]
      },
      {
        id: 'job-email',
        name: 'Job Application Email Builder',
        description: 'Professional job application emails',
        price: 200,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Email templates',
          'AI suggestions',
          'Customizable sections',
          'Professional tone',
          'Tracking',
          'Follow-up reminders'
        ]
      },
      {
        id: 'graphic-design',
        name: 'Graphic Design Tools',
        description: 'Professional design tools for everyone',
        price: 800,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          'Design templates',
          'Image editing',
          'Logo creator',
          'Social media graphics',
          'Export options',
          'Brand kit',
          'Collaboration tools'
        ]
      },
      {
        id: '3d-services',
        name: '3D Services',
        description: 'Professional 3D modeling and rendering',
        price: 5000,
        currency: 'MVR',
        period: 'one-time',
        popular: false,
        features: [
          '3D modeling',
          'Rendering services',
          'Animation',
          'Product visualization',
          'High-quality output',
          'Multiple formats',
          'Revisions included'
        ]
      }
    ]
    
    setServices(initialServices)
    localStorage.setItem('services', JSON.stringify(initialServices))
    
    // Also save to Firebase
    try {
      for (const service of initialServices) {
        await addDoc(collection(db, 'services'), service)
      }
    } catch (error) {
      console.error('Error saving default services to Firebase:', error)
    }
  }

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setPassword('')
  }

  const generateQuotationNumber = () => {
    const count = quotations.length + 1
    return `QT-${String(count).padStart(4, '0')}`
  }

  const generateInvoiceNumber = () => {
    const count = invoices.length + 1
    return `INV-${String(count).padStart(4, '0')}`
  }

  const calculateTotal = (items: LineItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const addLineItem = (type: 'quotation' | 'invoice') => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }

    if (type === 'quotation') {
      const updatedItems = [...newQuotation.items, newItem]
      setNewQuotation({ ...newQuotation, items: updatedItems })
    } else {
      const updatedItems = [...newInvoice.items, newItem]
      setNewInvoice({ ...newInvoice, items: updatedItems })
    }
  }

  const updateLineItem = (type: 'quotation' | 'invoice', itemId: string, field: keyof LineItem, value: any) => {
    if (type === 'quotation') {
      const updatedItems = newQuotation.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      })
      const subtotal = calculateTotal(updatedItems)
      setNewQuotation({ ...newQuotation, items: updatedItems, subtotal, total: subtotal + newQuotation.tax })
    } else {
      const updatedItems = newInvoice.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      })
      const subtotal = calculateTotal(updatedItems)
      setNewInvoice({ ...newInvoice, items: updatedItems, subtotal, total: subtotal + newInvoice.tax })
    }
  }

  const removeLineItem = (type: 'quotation' | 'invoice', itemId: string) => {
    if (type === 'quotation') {
      const updatedItems = newQuotation.items.filter(item => item.id !== itemId)
      const subtotal = calculateTotal(updatedItems)
      setNewQuotation({ ...newQuotation, items: updatedItems, subtotal, total: subtotal + newQuotation.tax })
    } else {
      const updatedItems = newInvoice.items.filter(item => item.id !== itemId)
      const subtotal = calculateTotal(updatedItems)
      setNewInvoice({ ...newInvoice, items: updatedItems, subtotal, total: subtotal + newInvoice.tax })
    }
  }

  const saveQuotation = () => {
    const quotation: Quotation = {
      ...newQuotation,
      id: Date.now().toString(),
      number: generateQuotationNumber(),
      status: 'sent'
    }
    const updated = [...quotations, quotation]
    setQuotations(updated)
    localStorage.setItem('quotations', JSON.stringify(updated))
    setShowNewQuotation(false)
    setNewQuotation({
      id: '', number: '', date: new Date().toISOString().split('T')[0], clientName: '', clientAddress: '',
      clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0, notes: '', status: 'draft'
    })
  }

  const saveInvoice = () => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now().toString(),
      number: generateInvoiceNumber(),
      status: newInvoice.paidAmount > 0 && newInvoice.paidAmount < newInvoice.total ? 'partial' : newInvoice.paidAmount >= newInvoice.total ? 'paid' : 'sent'
    }
    const updated = [...invoices, invoice]
    setInvoices(updated)
    localStorage.setItem('invoices', JSON.stringify(updated))
    setShowNewInvoice(false)
    setNewInvoice({
      id: '', number: '', date: new Date().toISOString().split('T')[0], dueDate: '', clientName: '',
      clientAddress: '', clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0,
      paidAmount: 0, notes: '', status: 'draft'
    })
  }

  const updateInvoicePayment = (invoiceId: string, paidAmount: number) => {
    const updated = invoices.map(inv => {
      if (inv.id === invoiceId) {
        const status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' = paidAmount > 0 && paidAmount < inv.total ? 'partial' : paidAmount >= inv.total ? 'paid' : 'sent'
        return { ...inv, paidAmount, status }
      }
      return inv
    })
    setInvoices(updated)
    localStorage.setItem('invoices', JSON.stringify(updated))
  }

  const generateQuotationPDF = (quotation: Quotation) => {
    const doc = new jsPDF()
    let y = 20

    if (companyInfo.logo) {
      try {
        doc.addImage(companyInfo.logo, 'JPEG', 20, y, 40, 40)
        y += 50
      } catch (e) {
        console.error('Error loading logo:', e)
      }
    }

    doc.setFontSize(20)
    doc.text(companyInfo.name, 20, y)
    y += 10

    doc.setFontSize(10)
    doc.text(companyInfo.address, 20, y)
    y += 7
    doc.text(`Phone: ${companyInfo.phone}`, 20, y)
    y += 7
    doc.text(`Email: ${companyInfo.email}`, 20, y)
    y += 7
    doc.text(`GST: ${companyInfo.gstNumber}`, 20, y)
    y += 15

    doc.setFontSize(24)
    doc.text('QUOTATION', 150, y)
    y += 10

    doc.setFontSize(12)
    doc.text(`Quotation #: ${quotation.number}`, 150, y)
    y += 7
    doc.text(`Date: ${quotation.date}`, 150, y)
    y += 15

    doc.setFontSize(14)
    doc.text('Bill To:', 20, y)
    y += 10

    doc.setFontSize(11)
    doc.text(quotation.clientName, 20, y)
    y += 7
    doc.text(quotation.clientAddress, 20, y)
    y += 7
    doc.text(`Email: ${quotation.clientEmail}`, 20, y)
    y += 7
    doc.text(`Phone: ${quotation.clientPhone}`, 20, y)
    y += 15

    doc.setFontSize(12)
    doc.text('Description', 20, y)
    doc.text('Qty', 120, y)
    doc.text('Rate', 140, y)
    doc.text('Amount', 170, y)
    y += 5

    doc.line(20, y, 190, y)
    y += 10

    quotation.items.forEach(item => {
      doc.setFontSize(10)
      const descLines = doc.splitTextToSize(item.description, 90)
      descLines.forEach((line: string, i: number) => {
        doc.text(line, 20, y + (i * 5))
      })
      doc.text(item.quantity.toString(), 120, y)
      doc.text(`$${item.rate.toFixed(2)}`, 140, y)
      doc.text(`$${item.amount.toFixed(2)}`, 170, y)
      y += Math.max(15, descLines.length * 5 + 5)
    })

    y += 10
    doc.line(20, y, 190, y)
    y += 10

    doc.text('Subtotal:', 130, y)
    doc.text(`$${quotation.subtotal.toFixed(2)}`, 170, y)
    y += 7
    doc.text('Tax:', 130, y)
    doc.text(`$${quotation.tax.toFixed(2)}`, 170, y)
    y += 7
    doc.setFontSize(14)
    doc.text('Total:', 130, y)
    doc.text(`$${quotation.total.toFixed(2)}`, 170, y)
    y += 15

    if (quotation.notes) {
      doc.setFontSize(10)
      doc.text('Notes:', 20, y)
      y += 7
      const noteLines = doc.splitTextToSize(quotation.notes, 170)
      noteLines.forEach((line: string) => {
        doc.text(line, 20, y)
        y += 5
      })
    }

    y += 20
    if (companyInfo.registryStamp) {
      try {
        doc.addImage(companyInfo.registryStamp, 'PNG', 140, y - 20, 40, 40)
      } catch (e) {
        console.error('Error loading stamp:', e)
      }
    }

    if (companyInfo.signature) {
      try {
        doc.addImage(companyInfo.signature, 'JPEG', 20, y, 50, 25)
        doc.setFontSize(10)
        doc.text('Authorized Signature', 20, y + 30)
      } catch (e) {
        console.error('Error loading signature:', e)
      }
    }

    doc.save(`Quotation-${quotation.number}.pdf`)
  }

  const generateInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF()
    let y = 20

    if (companyInfo.logo) {
      try {
        doc.addImage(companyInfo.logo, 'JPEG', 20, y, 40, 40)
        y += 50
      } catch (e) {
        console.error('Error loading logo:', e)
      }
    }

    doc.setFontSize(20)
    doc.text(companyInfo.name, 20, y)
    y += 10

    doc.setFontSize(10)
    doc.text(companyInfo.address, 20, y)
    y += 7
    doc.text(`Phone: ${companyInfo.phone}`, 20, y)
    y += 7
    doc.text(`Email: ${companyInfo.email}`, 20, y)
    y += 7
    doc.text(`GST: ${companyInfo.gstNumber}`, 20, y)
    y += 15

    doc.setFontSize(24)
    doc.text('INVOICE', 150, y)
    y += 10

    doc.setFontSize(12)
    doc.text(`Invoice #: ${invoice.number}`, 150, y)
    y += 7
    doc.text(`Date: ${invoice.date}`, 150, y)
    y += 7
    doc.text(`Due Date: ${invoice.dueDate}`, 150, y)
    y += 15

    doc.setFontSize(14)
    doc.text('Bill To:', 20, y)
    y += 10

    doc.setFontSize(11)
    doc.text(invoice.clientName, 20, y)
    y += 7
    doc.text(invoice.clientAddress, 20, y)
    y += 7
    doc.text(`Email: ${invoice.clientEmail}`, 20, y)
    y += 7
    doc.text(`Phone: ${invoice.clientPhone}`, 20, y)
    y += 15

    doc.setFontSize(12)
    doc.text('Description', 20, y)
    doc.text('Qty', 120, y)
    doc.text('Rate', 140, y)
    doc.text('Amount', 170, y)
    y += 5

    doc.line(20, y, 190, y)
    y += 10

    invoice.items.forEach(item => {
      doc.setFontSize(10)
      const descLines = doc.splitTextToSize(item.description, 90)
      descLines.forEach((line: string, i: number) => {
        doc.text(line, 20, y + (i * 5))
      })
      doc.text(item.quantity.toString(), 120, y)
      doc.text(`$${item.rate.toFixed(2)}`, 140, y)
      doc.text(`$${item.amount.toFixed(2)}`, 170, y)
      y += Math.max(15, descLines.length * 5 + 5)
    })

    y += 10
    doc.line(20, y, 190, y)
    y += 10

    doc.text('Subtotal:', 130, y)
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, y)
    y += 7
    doc.text('Tax:', 130, y)
    doc.text(`$${invoice.tax.toFixed(2)}`, 170, y)
    y += 7
    doc.text('Paid:', 130, y)
    doc.text(`$${invoice.paidAmount.toFixed(2)}`, 170, y)
    y += 7
    doc.setFontSize(14)
    doc.text('Balance:', 130, y)
    doc.text(`$${(invoice.total - invoice.paidAmount).toFixed(2)}`, 170, y)
    y += 15

    if (invoice.notes) {
      doc.setFontSize(10)
      doc.text('Notes:', 20, y)
      y += 7
      const noteLines = doc.splitTextToSize(invoice.notes, 170)
      noteLines.forEach((line: string) => {
        doc.text(line, 20, y)
        y += 5
      })
    }

    y += 20
    if (companyInfo.registryStamp) {
      try {
        doc.addImage(companyInfo.registryStamp, 'PNG', 140, y - 20, 40, 40)
      } catch (e) {
        console.error('Error loading stamp:', e)
      }
    }

    if (companyInfo.signature) {
      try {
        doc.addImage(companyInfo.signature, 'JPEG', 20, y, 50, 25)
        doc.setFontSize(10)
        doc.text('Authorized Signature', 20, y + 30)
      } catch (e) {
        console.error('Error loading signature:', e)
      }
    }

    doc.save(`Invoice-${invoice.number}.pdf`)
  }

  const getShareableLink = (id: string, type: 'quotation' | 'invoice') => {
    return `${window.location.origin}/view-${type}/${id}`
  }

  const saveCompanyInfo = () => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo))
    alert('Company information saved!')
  }

  const saveService = async () => {
    try {
      const serviceData = {
        name: newService.name,
        description: newService.description,
        price: newService.price,
        currency: newService.currency,
        period: newService.period,
        features: newService.features,
        popular: newService.popular
      }

      if (editingService) {
        // Update existing service
        const serviceRef = doc(db, 'services', editingService.id)
        await updateDoc(serviceRef, serviceData)
        
        const updated = services.map(s => 
          s.id === editingService.id 
            ? { ...s, ...serviceData } 
            : s
        )
        setServices(updated)
        setEditingService(null)
      } else {
        // Add new service
        const docRef = await addDoc(collection(db, 'services'), serviceData)
        const newServiceWithId: Service = {
          id: docRef.id,
          ...serviceData
        }
        const updated = [...services, newServiceWithId]
        setServices(updated)
      }

      // Update localStorage as backup
      localStorage.setItem('services', JSON.stringify(services))
      
      setShowNewService(false)
      setNewService({
        id: '', name: '', description: '', price: 0, currency: 'MVR', period: 'one-time', features: [], popular: false
      })
    } catch (error) {
      console.error('Error saving service to Firebase:', error)
      alert('Error saving service. Please try again.')
    }
  }

  const deleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', serviceId))
        const updated = services.filter(s => s.id !== serviceId)
        setServices(updated)
        localStorage.setItem('services', JSON.stringify(updated))
      } catch (error) {
        console.error('Error deleting service from Firebase:', error)
        alert('Error deleting service. Please try again.')
      }
    }
  }

  const editService = (service: Service) => {
    setEditingService(service)
    setNewService({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      currency: service.currency,
      period: service.period,
      features: [...service.features],
      popular: service.popular
    })
    setShowNewService(true)
  }

  const addServiceFeature = () => {
    setNewService({
      ...newService,
      features: [...newService.features, '']
    })
  }

  const updateServiceFeature = (index: number, value: string) => {
    const updatedFeatures = [...newService.features]
    updatedFeatures[index] = value
    setNewService({
      ...newService,
      features: updatedFeatures
    })
  }

  const removeServiceFeature = (index: number) => {
    const updatedFeatures = newService.features.filter((_, i) => i !== index)
    setNewService({
      ...newService,
      features: updatedFeatures
    })
  }

  const addServiceToQuotation = (service: Service) => {
    // Check if service already exists in items
    const existingItem = newQuotation.items?.find(item => item.description === service.name)
    
    if (existingItem) {
      // Remove if already exists (toggle behavior)
      removeLineItem('quotation', existingItem.id)
    } else {
      // Add new item from service
      const newItem: LineItem = {
        id: Date.now().toString(),
        description: service.name,
        quantity: 1,
        rate: service.price,
        amount: service.price
      }
      const updatedItems = [...(newQuotation.items || []), newItem]
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
      const total = subtotal + newQuotation.tax
      
      setNewQuotation({
        ...newQuotation,
        items: updatedItems,
        subtotal,
        total
      })
    }
  }

  const addServiceToInvoice = (service: Service) => {
    // Check if service already exists in items
    const existingItem = newInvoice.items?.find(item => item.description === service.name)
    
    if (existingItem) {
      // Remove if already exists (toggle behavior)
      removeLineItem('invoice', existingItem.id)
    } else {
      // Add new item from service
      const newItem: LineItem = {
        id: Date.now().toString(),
        description: service.name,
        quantity: 1,
        rate: service.price,
        amount: service.price
      }
      const updatedItems = [...(newInvoice.items || []), newItem]
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
      const total = subtotal + newInvoice.tax
      
      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        subtotal,
        total
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter password to access</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleLogin} className="w-full">Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="flex gap-4 mb-8 border-b">
          <Button
            variant={activeTab === 'dashboard' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'quotations' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('quotations')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Quotations
          </Button>
          <Button
            variant={activeTab === 'invoices' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('invoices')}
          >
            <Receipt className="w-4 h-4 mr-2" />
            Invoices
          </Button>
          <Button
            variant={activeTab === 'company' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('company')}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Company
          </Button>
          <Button
            variant={activeTab === 'services' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('services')}
          >
            <Package className="w-4 h-4 mr-2" />
            Services
          </Button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600 dark:text-gray-400 text-sm">Total Quotations</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{quotations.length}</p></div><FileText className="w-12 h-12 text-blue-500" /></div></CardContent></Card>
            <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600 dark:text-gray-400 text-sm">Total Invoices</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{invoices.length}</p></div><Receipt className="w-12 h-12 text-green-500" /></div></CardContent></Card>
            <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600 dark:text-gray-400 text-sm">Paid Invoices</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{invoices.filter((i) => i.status === 'paid').length}</p></div><CheckCircle className="w-12 h-12 text-emerald-500" /></div></CardContent></Card>
            <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{invoices.filter((i) => i.status !== 'paid').length}</p></div><Building2 className="w-12 h-12 text-orange-500" /></div></CardContent></Card>
          </div>
        )}

        {activeTab === 'quotations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quotations</h2>
              <Button onClick={() => setShowNewQuotation(true)}><Plus className="w-4 h-4 mr-2" />New Quotation</Button>
            </div>
            
            {showNewQuotation && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">Create New Quotation</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Date</Label><Input type="date" value={newQuotation.date} onChange={(e) => setNewQuotation({...newQuotation, date: e.target.value})} /></div>
                    <div><Label>Client Name *</Label><Input value={newQuotation.clientName} onChange={(e) => setNewQuotation({...newQuotation, clientName: e.target.value})} placeholder="Enter client name" /></div>
                    <div><Label>Client Address</Label><Input value={newQuotation.clientAddress} onChange={(e) => setNewQuotation({...newQuotation, clientAddress: e.target.value})} placeholder="Enter client address" /></div>
                    <div><Label>Client Email</Label><Input type="email" value={newQuotation.clientEmail} onChange={(e) => setNewQuotation({...newQuotation, clientEmail: e.target.value})} placeholder="Enter client email" /></div>
                    <div><Label>Client Phone</Label><Input value={newQuotation.clientPhone} onChange={(e) => setNewQuotation({...newQuotation, clientPhone: e.target.value})} placeholder="Enter client phone" /></div>
                    <div><Label>Tax Amount</Label><Input type="number" value={newQuotation.tax} onChange={(e) => setNewQuotation({...newQuotation, tax: parseFloat(e.target.value) || 0})} /></div>
                  </div>
                  
                  <div>
                    <Label>Select Services</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          onClick={() => addServiceToQuotation(service)}
                          className="cursor-pointer"
                        >
                          <Card 
                            className={`transition-all hover:shadow-md ${
                              newQuotation.items?.some(item => item.description === service.name) 
                                ? 'border-2 border-primary-500 bg-primary-50' 
                                : 'border border-gray-200'
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm">{service.name}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                                </div>
                                <span className="text-sm font-bold text-primary">
                                  {service.price.toLocaleString()} {service.currency}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Items</Label>
                    {newQuotation.items?.map((item: LineItem) => (
                      <div key={item.id} className="flex gap-2 mb-2 items-end">
                        <div className="flex-1"><Label>Description</Label><Input value={item.description} onChange={(e) => updateLineItem('quotation', item.id, 'description', e.target.value)} placeholder="Item description" /></div>
                        <div className="w-20"><Label>Qty</Label><Input type="number" value={item.quantity} onChange={(e) => updateLineItem('quotation', item.id, 'quantity', parseFloat(e.target.value) || 0)} /></div>
                        <div className="w-24"><Label>Rate</Label><Input type="number" value={item.rate} onChange={(e) => updateLineItem('quotation', item.id, 'rate', parseFloat(e.target.value) || 0)} /></div>
                        <div className="w-24"><Label>Amount</Label><Input type="number" value={item.amount} readOnly /></div>
                        <Button size="sm" variant="danger" onClick={() => removeLineItem('quotation', item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addLineItem('quotation')} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Custom Item</Button>
                  </div>

                  <div><Label>Notes</Label><Input value={newQuotation.notes} onChange={(e) => setNewQuotation({...newQuotation, notes: e.target.value})} placeholder="Additional notes" /></div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Subtotal: <span className="font-bold">${newQuotation.subtotal?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Tax: <span className="font-bold">${newQuotation.tax?.toFixed(2)}</span></p>
                      <p className="text-lg font-bold text-primary">Total: ${newQuotation.total?.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNewQuotation(false)}>Cancel</Button>
                      <Button onClick={saveQuotation}>Save Quotation</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {quotations.map((q) => (
                <Card key={q.id}><CardContent className="p-6"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h3 className="font-semibold">{q.number}</h3><p className="text-sm text-gray-600">{q.clientName}</p><p className="text-sm text-gray-600">{q.date}</p><p className="text-lg font-bold text-primary">${q.total.toFixed(2)}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => generateQuotationPDF(q)}><Download className="w-4 h-4 mr-2" />PDF</Button><Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(getShareableLink(q.id, 'quotation')); alert('Link copied!')}}><Share2 className="w-4 h-4 mr-2" />Share</Button></div></div></CardContent></Card>
              ))}
              {quotations.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No quotations yet</p></CardContent></Card>}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoices</h2>
              <Button onClick={() => setShowNewInvoice(true)}><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
            </div>
            
            {showNewInvoice && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">Create New Invoice</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Date</Label><Input type="date" value={newInvoice.date} onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})} /></div>
                    <div><Label>Due Date</Label><Input type="date" value={newInvoice.dueDate} onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})} /></div>
                    <div><Label>Client Name *</Label><Input value={newInvoice.clientName} onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})} placeholder="Enter client name" /></div>
                    <div><Label>Client Address</Label><Input value={newInvoice.clientAddress} onChange={(e) => setNewInvoice({...newInvoice, clientAddress: e.target.value})} placeholder="Enter client address" /></div>
                    <div><Label>Client Email</Label><Input type="email" value={newInvoice.clientEmail} onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})} placeholder="Enter client email" /></div>
                    <div><Label>Client Phone</Label><Input value={newInvoice.clientPhone} onChange={(e) => setNewInvoice({...newInvoice, clientPhone: e.target.value})} placeholder="Enter client phone" /></div>
                    <div><Label>Tax Amount</Label><Input type="number" value={newInvoice.tax} onChange={(e) => setNewInvoice({...newInvoice, tax: parseFloat(e.target.value) || 0})} /></div>
                    <div><Label>Paid Amount</Label><Input type="number" value={newInvoice.paidAmount} onChange={(e) => setNewInvoice({...newInvoice, paidAmount: parseFloat(e.target.value) || 0})} /></div>
                  </div>
                  
                  <div>
                    <Label>Select Services</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          onClick={() => addServiceToInvoice(service)}
                          className="cursor-pointer"
                        >
                          <Card 
                            className={`transition-all hover:shadow-md ${
                              newInvoice.items?.some(item => item.description === service.name) 
                                ? 'border-2 border-primary-500 bg-primary-50' 
                                : 'border border-gray-200'
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm">{service.name}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                                </div>
                                <span className="text-sm font-bold text-primary">
                                  {service.price.toLocaleString()} {service.currency}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Items</Label>
                    {newInvoice.items?.map((item: LineItem) => (
                      <div key={item.id} className="flex gap-2 mb-2 items-end">
                        <div className="flex-1"><Label>Description</Label><Input value={item.description} onChange={(e) => updateLineItem('invoice', item.id, 'description', e.target.value)} placeholder="Item description" /></div>
                        <div className="w-20"><Label>Qty</Label><Input type="number" value={item.quantity} onChange={(e) => updateLineItem('invoice', item.id, 'quantity', parseFloat(e.target.value) || 0)} /></div>
                        <div className="w-24"><Label>Rate</Label><Input type="number" value={item.rate} onChange={(e) => updateLineItem('invoice', item.id, 'rate', parseFloat(e.target.value) || 0)} /></div>
                        <div className="w-24"><Label>Amount</Label><Input type="number" value={item.amount} readOnly /></div>
                        <Button size="sm" variant="danger" onClick={() => removeLineItem('invoice', item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addLineItem('invoice')} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Custom Item</Button>
                  </div>

                  <div><Label>Notes</Label><Input value={newInvoice.notes} onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})} placeholder="Additional notes" /></div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Subtotal: <span className="font-bold">${newInvoice.subtotal?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Tax: <span className="font-bold">${newInvoice.tax?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Paid: <span className="font-bold">${newInvoice.paidAmount?.toFixed(2)}</span></p>
                      <p className="text-lg font-bold text-primary">Balance: ${(newInvoice.total || 0 - (newInvoice.paidAmount || 0)).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNewInvoice(false)}>Cancel</Button>
                      <Button onClick={saveInvoice}>Save Invoice</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {invoices.map((inv) => (
                <Card key={inv.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{inv.number}</h3>
                        <p className="text-sm text-gray-600">{inv.clientName}</p>
                        <p className="text-sm text-gray-600">{inv.date} - Due: {inv.dueDate}</p>
                        <p className="text-lg font-bold text-primary">${inv.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Paid: ${inv.paidAmount.toFixed(2)} | Balance: ${(inv.total - inv.paidAmount).toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{inv.status.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => generateInvoicePDF(inv)}><Download className="w-4 h-4 mr-2" />PDF</Button>
                          <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(getShareableLink(inv.id, 'invoice')); alert('Link copied!')}}><Share2 className="w-4 h-4 mr-2" />Share</Button>
                        </div>
                        {inv.status !== 'paid' && (
                          <div className="flex gap-2 items-center">
                            <Input type="number" placeholder="Payment amount" className="w-32" defaultValue={inv.paidAmount} onBlur={(e) => updateInvoicePayment(inv.id, parseFloat(e.target.value) || 0)} />
                            <Button size="sm" onClick={() => {const input = document.querySelector(`input[placeholder="Payment amount"]`) as HTMLInputElement; if(input) updateInvoicePayment(inv.id, parseFloat(input.value) || 0)}}>Update Payment</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {invoices.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No invoices yet</p></CardContent></Card>}
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <Card>
            <CardHeader><h2 className="text-xl font-bold">Company Information</h2></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Company Name</Label><Input value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} /></div>
              <div><Label>Address</Label><Input value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})} /></div>
              <div><Label>Phone</Label><Input value={companyInfo.phone} onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})} /></div>
              <div><Label>Email</Label><Input value={companyInfo.email} onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})} /></div>
              <div><Label>GST Number</Label><Input value={companyInfo.gstNumber} onChange={(e) => setCompanyInfo({...companyInfo, gstNumber: e.target.value})} /></div>
              <div><Label>Logo URL</Label><Input value={companyInfo.logo} onChange={(e) => setCompanyInfo({...companyInfo, logo: e.target.value})} placeholder="/logo.jpeg" /></div>
              <div><Label>Registry Stamp URL</Label><Input value={companyInfo.registryStamp} onChange={(e) => setCompanyInfo({...companyInfo, registryStamp: e.target.value})} placeholder="/stamp.png" /></div>
              <div><Label>Signature URL</Label><Input value={companyInfo.signature} onChange={(e) => setCompanyInfo({...companyInfo, signature: e.target.value})} placeholder="/Abobakuru e signature.jpeg" /></div>
              <Button onClick={saveCompanyInfo}>Save Company Information</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services</h2>
              <Button onClick={() => setShowNewService(true)}><Plus className="w-4 h-4 mr-2" />Add Service</Button>
            </div>

            {showNewService && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Service Name *</Label><Input value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} placeholder="e.g., HRMS Starter" /></div>
                    <div><Label>Price *</Label><Input type="number" value={newService.price} onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})} placeholder="10000" /></div>
                    <div><Label>Currency</Label><Input value={newService.currency} onChange={(e) => setNewService({...newService, currency: e.target.value})} placeholder="MVR" /></div>
                    <div><Label>Period</Label><Input value={newService.period} onChange={(e) => setNewService({...newService, period: e.target.value})} placeholder="one-time" /></div>
                  </div>
                  <div><Label>Description</Label><Input value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} placeholder="Perfect for small organizations" /></div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="popular" checked={newService.popular} onChange={(e) => setNewService({...newService, popular: e.target.checked})} />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>
                  <div>
                    <Label>Features</Label>
                    {newService.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input value={feature} onChange={(e) => updateServiceFeature(index, e.target.value)} placeholder="Feature description" />
                        <Button size="sm" variant="danger" onClick={() => removeServiceFeature(index)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={addServiceFeature}><Plus className="w-4 h-4 mr-2" />Add Feature</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowNewService(false)
                      setEditingService(null)
                      setNewService({
                        id: '', name: '', description: '', price: 0, currency: 'MVR', period: 'one-time', features: [], popular: false
                      })
                    }}>Cancel</Button>
                    <Button onClick={saveService}>{editingService ? 'Update Service' : 'Save Service'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className={service.popular ? 'border-2 border-primary-500' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      {service.popular && <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">Popular</span>}
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold">{service.price.toLocaleString()}</span>
                      <span className="text-gray-600"> {service.currency}</span>
                      <p className="text-sm text-primary-600">{service.period}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editService(service)} className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteService(service.id)} className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {services.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No services added yet</p></CardContent></Card>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
