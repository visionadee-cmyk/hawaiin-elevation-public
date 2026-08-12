import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Lock, FileText, Receipt, CheckCircle, Share2, Download, Plus, Building2, LogOut, Trash2, Package, Edit, Eye, X } from 'lucide-react'
import jsPDF from 'jspdf'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'

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
  directorId?: string
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

interface Customer {
  id: string
  name: string
  address: string
  email: string
  phone: string
  company?: string
  gstNumber?: string
}

interface TermsAndConditions {
  id: string
  title: string
  content: string
  version: string
  effectiveDate: string
}

interface Director {
  id: string
  name: string
  position: string
  signature: string
  isActive: boolean
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotations' | 'invoices' | 'company' | 'services' | 'customers' | 'terms' | 'directors'>('dashboard')
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Hawaiin Elevation PLC',
    logo: '/logo.jpeg',
    address: '',
    gstNumber: '',
    registryStamp: '/stamp.png',
    phone: '',
    email: '',
    signature: '/Abobakuru e signature.jpeg',
    managingDirector: 'Aboobakuru Gasim'
  })
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [terms, setTerms] = useState<TermsAndConditions[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [showNewQuotation, setShowNewQuotation] = useState(false)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [showNewService, setShowNewService] = useState(false)
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [showNewTerm, setShowNewTerm] = useState(false)
  const [showNewDirector, setShowNewDirector] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editingTerm, setEditingTerm] = useState<TermsAndConditions | null>(null)
  const [editingDirector, setEditingDirector] = useState<Director | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewType, setPreviewType] = useState<'quotation' | 'invoice'>('quotation')
  const [previewData, setPreviewData] = useState<Quotation | Invoice | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [imageCache, setImageCache] = useState<Record<string, string>>({})
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const [newQuotation, setNewQuotation] = useState<Quotation>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], clientName: '', clientAddress: '',
    clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0, notes: '', status: 'draft', directorId: ''
  })

  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], dueDate: '', clientName: '',
    clientAddress: '', clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0,
    paidAmount: 0, notes: '', status: 'draft'
  })

  const [newService, setNewService] = useState<Service>({
    id: '', name: '', description: '', price: 0, currency: 'MVR', period: 'one-time', features: [], popular: false
  })

  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: '', name: '', address: '', email: '', phone: '', company: '', gstNumber: ''
  })

  const [newTerm, setNewTerm] = useState<TermsAndConditions>({
    id: '', title: '', content: '', version: '1.0', effectiveDate: new Date().toISOString().split('T')[0]
  })

  const [newDirector, setNewDirector] = useState<Director>({
    id: '', name: '', position: '', signature: '', isActive: true
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

    // Load quotations from Firebase
    try {
      const quotationsQuery = query(collection(db, 'quotations'), orderBy('date', 'desc'))
      const quotationsSnapshot = await getDocs(quotationsQuery)
      const quotationsData = quotationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quotation[]
      setQuotations(quotationsData)
      localStorage.setItem('quotations', JSON.stringify(quotationsData))
    } catch (error) {
      console.error('Error loading quotations from Firebase:', error)
      const savedQuotations = localStorage.getItem('quotations')
      if (savedQuotations) setQuotations(JSON.parse(savedQuotations) as Quotation[])
    }

    // Load invoices from Firebase
    try {
      const invoicesQuery = query(collection(db, 'invoices'), orderBy('date', 'desc'))
      const invoicesSnapshot = await getDocs(invoicesQuery)
      const invoicesData = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[]
      setInvoices(invoicesData)
      localStorage.setItem('invoices', JSON.stringify(invoicesData))
    } catch (error) {
      console.error('Error loading invoices from Firebase:', error)
      const savedInvoices = localStorage.getItem('invoices')
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices) as Invoice[])
    }

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

    // Load customers from Firebase
    try {
      const customersQuery = query(collection(db, 'customers'), orderBy('name'))
      const customersSnapshot = await getDocs(customersQuery)
      const customersData = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[]
      setCustomers(customersData)
      localStorage.setItem('customers', JSON.stringify(customersData))
    } catch (error) {
      console.error('Error loading customers from Firebase:', error)
      const savedCustomers = localStorage.getItem('customers')
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers) as Customer[])
      }
    }

    // Load directors from Firebase
    try {
      const directorsQuery = query(collection(db, 'directors'), orderBy('name'))
      const directorsSnapshot = await getDocs(directorsQuery)
      const directorsData = directorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Director[]
      
      if (directorsData.length > 0) {
        setDirectors(directorsData)
      } else {
        await initializeDefaultDirectors()
      }
    } catch (error) {
      console.error('Error loading directors from Firebase:', error)
      const savedDirectors = localStorage.getItem('directors')
      if (savedDirectors) {
        setDirectors(JSON.parse(savedDirectors) as Director[])
      } else {
        await initializeDefaultDirectors()
      }
    }

    // Load terms from Firebase
    try {
      const termsQuery = query(collection(db, 'terms'), orderBy('effectiveDate', 'desc'))
      const termsSnapshot = await getDocs(termsQuery)
      const termsData = termsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TermsAndConditions[]
      
      if (termsData.length > 0) {
        setTerms(termsData)
      } else {
        await initializeDefaultTerms()
      }
    } catch (error) {
      console.error('Error loading terms from Firebase:', error)
      const savedTerms = localStorage.getItem('terms')
      if (savedTerms) {
        setTerms(JSON.parse(savedTerms) as TermsAndConditions[])
      } else {
        await initializeDefaultTerms()
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
    
    // Also save to Firebase (only if not already exists)
    try {
      for (const service of initialServices) {
        // Check if service already exists in Firebase
        const existingQuery = query(collection(db, 'services'), where('id', '==', service.id))
        const existingSnapshot = await getDocs(existingQuery)
        if (existingSnapshot.empty) {
          await addDoc(collection(db, 'services'), service)
        }
      }
    } catch (error) {
      console.error('Error saving default services to Firebase:', error)
    }
  }

  const initializeDefaultDirectors = async () => {
    const initialDirectors: Director[] = [
      {
        id: 'adam-gasim',
        name: 'Adam Gasim',
        position: 'Director of Administration',
        signature: '/Adam e signature copy.jpeg',
        isActive: true
      },
      {
        id: 'aboobakuru-gasim',
        name: 'Aboobakuru Gasim',
        position: 'Managing Director',
        signature: '/Abobakuru e signature.jpeg',
        isActive: true
      },
      {
        id: 'abdul-rahman-gasim',
        name: 'Abdul Rahman Gasim',
        position: 'Director of Technology',
        signature: '/Abdul e signature copy 5.jpeg',
        isActive: true
      },
      {
        id: 'faiz-gasim',
        name: 'Faiz Gasim',
        position: 'Director of Commercial & Tendering',
        signature: '/faiz e signature copy 4.jpeg',
        isActive: true
      },
      {
        id: 'ibrahim-gasim',
        name: 'Ibrahim Gasim',
        position: 'Director of Projects & Maintenance',
        signature: '/ibrahim e signature copy 2.jpeg',
        isActive: true
      }
    ]
    
    setDirectors(initialDirectors)
    localStorage.setItem('directors', JSON.stringify(initialDirectors))
    
    try {
      for (const director of initialDirectors) {
        const existingQuery = query(collection(db, 'directors'), where('id', '==', director.id))
        const existingSnapshot = await getDocs(existingQuery)
        if (existingSnapshot.empty) {
          await addDoc(collection(db, 'directors'), director)
        }
      }
    } catch (error) {
      console.error('Error saving default directors to Firebase:', error)
    }
  }

  const initializeDefaultTerms = async () => {
    const initialTerms: TermsAndConditions[] = [
      {
        id: '3d-services',
        title: '3D Services — MVR 5,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 1,500: Initial payment before commencement.
30% — MVR 1,500: Upon completion and approval of Phase 1, including initial 3D modeling/blockout.
40% — MVR 2,000: Upon completion of final modeling, rendering, animation/product visualization, and delivery of agreed files.

Project Terms:
- The project will commence only after receipt of the 30% advance payment.
- The client must provide all required reference materials, dimensions, logos, images, drawings, and specifications before work begins.
- Phase 1 approval confirms the basic design direction and structure.
- Changes to an already approved phase may be treated as additional work and may incur additional charges.
- The quoted price includes the revisions reasonably required to complete the agreed scope.
- Final high-resolution files and editable/source files, where included in the agreed scope, will be released after payment of the final 40%.
- Additional animation duration, modeling complexity, rendering requirements, or major design changes may be quoted separately.
- Project timelines depend on timely client feedback and supply of required information.`
      },
      {
        id: 'business-proposal-builder',
        title: 'Business Proposal Builder — MVR 1,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 300: Initial payment before development.
30% — MVR 300: After Phase 1, including proposal structure, templates, and pricing-table setup.
40% — MVR 400: Upon completion, testing, and delivery.

Terms:
- The client must provide company information, pricing details, branding materials, and required proposal content.
- The first phase establishes the structure and visual direction.
- Approved content and design changes after Phase 1 may be charged separately if they materially change the agreed scope.
- Third-party services, subscriptions, hosting, domain fees, payment gateways, or digital-signature services are not included unless specifically stated.
- Final delivery/access will be provided after settlement of the outstanding balance.
- Client is responsible for reviewing all proposal content before use.
- Any ongoing maintenance or future modifications are separate from the one-time project fee.`
      },
      {
        id: 'cv-builder',
        title: 'CV Builder — MVR 500',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 150: Initial payment.
30% — MVR 150: After Phase 1, including template and CV structure.
40% — MVR 200: Upon final completion and delivery.

Terms:
- Client must provide accurate employment, education, skills, contact, and other CV information.
- AI-generated suggestions are provided as assistance and must be reviewed by the client.
- The service does not guarantee employment, interviews, or job offers.
- Revisions are limited to the agreed scope and template/design.
- Major redesigns or additional CV versions may be charged separately.
- Final PDF/print-ready files will be provided after full payment.
- Client remains responsible for verifying the accuracy of all personal and professional information.`
      },
      {
        id: 'company-profile-builder',
        title: 'Company Profile Builder — MVR 2,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 600: Initial payment.
30% — MVR 600: After Phase 1, including company-profile structure, content organization, and initial design.
40% — MVR 800: Upon final approval and delivery.

Terms:
- Client must provide company history, services, team information, achievements, images, logos, and other required materials.
- Client is responsible for ensuring that supplied company information is accurate and legally permitted for publication.
- Phase 1 approval confirms the overall design and content direction.
- Significant changes after approval may incur additional fees.
- Final PDF and print-ready files will be delivered after full payment.
- Printing, professional photography, stock images, paid fonts, or third-party assets are excluded unless specifically agreed.
- Additional pages beyond the agreed scope may be quoted separately.`
      },
      {
        id: 'company-website-builder',
        title: 'Company Website Builder — MVR 3,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 900: Initial payment before development.
30% — MVR 900: After Phase 1, including website structure, design direction, and initial pages.
40% — MVR 1,200: Upon completion, testing, approval, and launch/delivery.

Terms:
- Client must provide website content, logos, images, contact information, product/service information, and other required materials.
- Domain registration, hosting, premium plugins, paid themes, third-party APIs, payment gateway charges, and other external services are excluded unless stated otherwise.
- Phase 1 approval confirms the website's core structure and design direction.
- Content supplied by the client remains the client's responsibility.
- Major changes to the approved website structure may incur additional charges.
- The client must review and approve the website before final launch.
- Final website access, source files, or administrative credentials may be provided after full payment.
- Website maintenance after completion is not included unless covered by a separate agreement.
- E-commerce functionality is subject to the capabilities and fees of the selected payment gateway and third-party services.`
      },
      {
        id: 'cover-letter-builder',
        title: 'Cover Letter Builder — MVR 300',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 90: Initial payment.
30% — MVR 90: After Phase 1, including content structure and initial cover-letter format.
40% — MVR 120: Upon final completion and delivery.

Terms:
- Client must provide accurate CV and job-position information.
- AI-generated content is subject to client review and approval.
- The service does not guarantee employment or interview results.
- Reasonable revisions within the agreed scope are included.
- Additional versions for different positions may be charged separately if they exceed the agreed scope.
- Final documents will be delivered after full payment.`
      },
      {
        id: 'graphic-design-tools',
        title: 'Graphic Design Tools — MVR 800',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 240: Initial payment.
30% — MVR 240: After Phase 1, including initial design concepts/templates.
40% — MVR 320: Upon final completion and delivery.

Terms:
- Client must provide logos, brand colors, text, images, and other required assets.
- The quoted price covers the agreed design scope only.
- Additional designs, concepts, revisions, or formats outside the agreed scope may incur additional fees.
- Client-supplied materials must not infringe third-party rights.
- Final high-resolution/exported files will be delivered after full payment.
- Editable/source files are included only where specifically agreed.
- Third-party stock images, fonts, plugins, or paid assets may incur additional costs.`
      },
      {
        id: 'hrms-enterprise',
        title: 'HRMS Enterprise — MVR 30,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 9,000: Initial payment and project commencement.
30% — MVR 9,000: Upon completion and approval of Phase 1, including system configuration, core HRMS setup, and agreed workflow design.
40% — MVR 12,000: Upon final implementation, testing, deployment, and handover.

Terms:
- The client must provide all required employee, organizational, payroll, attendance, workflow, and configuration information.
- Project implementation is subject to the client's cooperation and timely provision of information.
- Custom integrations, biometric devices, third-party APIs, hosting, infrastructure, SMS services, payment services, and other external services are subject to their respective costs unless expressly included.
- On-premise deployment requires suitable infrastructure to be provided by the client unless otherwise agreed.
- Acceptance testing will be conducted before final handover.
- Any material change to the agreed requirements after approval may be treated as a change request and quoted separately.
- Training and onboarding will be provided according to the agreed implementation plan.
- The one-year post-sales customization period applies only to the agreed scope and does not include major new modules or substantially new functionality.
- SLA and support commitments are subject to the final service agreement.
- The client is responsible for the legality, accuracy, and security of data supplied to the system.
- Final administrative access and ownership handover will be completed following settlement of the outstanding balance, subject to the agreed deployment arrangement.`
      },
      {
        id: 'hrms-professional',
        title: 'HRMS Professional — MVR 20,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 6,000: Initial payment.
30% — MVR 6,000: After Phase 1, including core HRMS configuration and employee-management setup.
40% — MVR 8,000: Upon final implementation, testing, training, and handover.

Terms:
- Includes functionality stated in the Professional package for up to 100 employees.
- Additional employees beyond the agreed limit may require a revised quotation.
- Client must provide accurate employee and organizational data.
- Biometric integration is subject to compatibility with supported devices.
- Custom integrations or functionality outside the stated scope are chargeable separately.
- Six months of post-sales customization applies to agreed system functionality and does not include major new modules.
- Hosting, third-party software, hardware, SMS, payment gateways, and external services are excluded unless expressly included.
- Final system access and handover occur after full payment.`
      },
      {
        id: 'hrms-starter',
        title: 'HRMS Starter — MVR 10,000',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 3,000: Initial payment.
30% — MVR 3,000: After Phase 1, including employee-management and attendance setup.
40% — MVR 4,000: Upon final completion, testing, and handover.

Terms:
- Package covers up to 25 employees and the features specifically listed in the package.
- Additional employees or features may require an additional quotation.
- Client must provide accurate employee and organizational information.
- Three months of post-sales customization applies only to the agreed scope.
- Major feature additions and custom integrations are not included.
- Third-party services, hosting, hardware, biometric devices, and external software costs are excluded unless agreed in writing.
- Final access and handover will be completed after full payment.`
      },
      {
        id: 'job-application-email-builder',
        title: 'Job Application Email Builder — MVR 200',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 60: Initial payment.
30% — MVR 60: After Phase 1, including email structure and template setup.
40% — MVR 80: Upon final completion and delivery.

Terms:
- Client must provide accurate job and personal information.
- AI-generated suggestions should be reviewed before sending.
- Tracking and follow-up features are subject to the capabilities of the selected email system.
- Third-party email services or integrations may have separate charges.
- The service does not guarantee job applications will result in interviews or employment.
- Final delivery is subject to settlement of the full project fee.`
      },
      {
        id: 'personal-website-builder',
        title: 'Personal Website Builder — MVR 1,500',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 450: Initial payment.
30% — MVR 450: After Phase 1, including website structure, template, and initial content.
40% — MVR 600: Upon final completion, testing, and delivery.

Terms:
- Client must provide biography, portfolio information, photographs, social links, contact details, and other required content.
- Domain and hosting charges are excluded unless specifically included.
- Premium themes, plugins, stock images, and third-party services may incur additional fees.
- Client is responsible for reviewing and approving all published information.
- Major changes after Phase 1 approval may incur additional charges.
- Website maintenance and future updates are not included unless separately agreed.
- Final website access and files will be handed over after full payment.`
      },
      {
        id: 'portfolio-builder',
        title: 'Portfolio Builder — MVR 750',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        content: `Payment Schedule:
30% — MVR 225: Initial payment.
30% — MVR 225: After Phase 1, including portfolio structure and initial design.
40% — MVR 300: Upon final completion and delivery.

Terms:
- Client must provide portfolio items, project descriptions, images, contact information, and other required materials.
- Custom domain and hosting costs are excluded unless specifically stated.
- Client is responsible for obtaining permission to publish images, project materials, and third-party content.
- Reasonable revisions within the agreed scope are included.
- Additional pages, functionality, or major redesigns may be quoted separately.
- Final access and delivery are subject to full payment.`
      }
    ]
    
    setTerms(initialTerms)
    localStorage.setItem('terms', JSON.stringify(initialTerms))
    
    try {
      for (const term of initialTerms) {
        const existingQuery = query(collection(db, 'terms'), where('id', '==', term.id))
        const existingSnapshot = await getDocs(existingQuery)
        if (existingSnapshot.empty) {
          await addDoc(collection(db, 'terms'), term)
        }
      }
    } catch (error) {
      console.error('Error saving default terms to Firebase:', error)
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

  const saveQuotation = async () => {
    const quotation: Quotation = {
      ...newQuotation,
      id: Date.now().toString(),
      number: generateQuotationNumber(),
      status: 'sent'
    }
    const updated = [...quotations, quotation]
    setQuotations(updated)
    localStorage.setItem('quotations', JSON.stringify(updated))
    
    // Save to Firebase
    try {
      await addDoc(collection(db, 'quotations'), quotation)
    } catch (error) {
      console.error('Error saving quotation to Firebase:', error)
    }
    
    setShowNewQuotation(false)
    setNewQuotation({
      id: '', number: '', date: new Date().toISOString().split('T')[0], clientName: '', clientAddress: '',
      clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0, notes: '', status: 'draft'
    })
  }

  const saveInvoice = async () => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now().toString(),
      number: generateInvoiceNumber(),
      status: newInvoice.paidAmount > 0 && newInvoice.paidAmount < newInvoice.total ? 'partial' : newInvoice.paidAmount >= newInvoice.total ? 'paid' : 'sent'
    }
    const updated = [...invoices, invoice]
    setInvoices(updated)
    localStorage.setItem('invoices', JSON.stringify(updated))
    
    // Save to Firebase
    try {
      await addDoc(collection(db, 'invoices'), invoice)
    } catch (error) {
      console.error('Error saving invoice to Firebase:', error)
    }
    
    setShowNewInvoice(false)
    setNewInvoice({
      id: '', number: '', date: new Date().toISOString().split('T')[0], dueDate: '', clientName: '',
      clientAddress: '', clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0,
      paidAmount: 0, notes: '', status: 'draft'
    })
  }

  const saveCustomer = async () => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString()
    }
    const updated = [...customers, customer]
    setCustomers(updated)
    localStorage.setItem('customers', JSON.stringify(updated))
    
    // Save to Firebase
    try {
      await addDoc(collection(db, 'customers'), customer)
    } catch (error) {
      console.error('Error saving customer to Firebase:', error)
    }
    
    setShowNewCustomer(false)
    setNewCustomer({
      id: '', name: '', address: '', email: '', phone: '', company: '', gstNumber: ''
    })
  }

  const editCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setNewCustomer({ ...customer })
    setShowNewCustomer(true)
  }

  const deleteCustomer = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const updated = customers.filter(c => c.id !== customerId)
      setCustomers(updated)
      localStorage.setItem('customers', JSON.stringify(updated))
      
      // Delete from Firebase
      try {
        await deleteDoc(doc(db, 'customers', customerId))
      } catch (error) {
        console.error('Error deleting customer from Firebase:', error)
      }
    }
  }

  const selectCustomer = (customer: Customer, type: 'quotation' | 'invoice') => {
    if (type === 'quotation') {
      setNewQuotation({
        ...newQuotation,
        clientName: customer.name,
        clientAddress: customer.address,
        clientEmail: customer.email,
        clientPhone: customer.phone
      })
    } else {
      setNewInvoice({
        ...newInvoice,
        clientName: customer.name,
        clientAddress: customer.address,
        clientEmail: customer.email,
        clientPhone: customer.phone
      })
    }
  }

  const saveTerm = async () => {
    const term: TermsAndConditions = {
      ...newTerm,
      id: Date.now().toString()
    }
    const updated = [...terms, term]
    setTerms(updated)
    localStorage.setItem('terms', JSON.stringify(updated))
    
    try {
      await addDoc(collection(db, 'terms'), term)
    } catch (error) {
      console.error('Error saving term to Firebase:', error)
    }
    
    setShowNewTerm(false)
    setNewTerm({
      id: '', title: '', content: '', version: '1.0', effectiveDate: new Date().toISOString().split('T')[0]
    })
  }

  const editTerm = (term: TermsAndConditions) => {
    setEditingTerm(term)
    setNewTerm({ ...term })
    setShowNewTerm(true)
  }

  const deleteTerm = async (termId: string) => {
    if (confirm('Are you sure you want to delete this term?')) {
      const updated = terms.filter(t => t.id !== termId)
      setTerms(updated)
      localStorage.setItem('terms', JSON.stringify(updated))
      
      try {
        await deleteDoc(doc(db, 'terms', termId))
      } catch (error) {
        console.error('Error deleting term from Firebase:', error)
      }
    }
  }

  const saveDirector = async () => {
    const director: Director = {
      ...newDirector,
      id: Date.now().toString()
    }
    const updated = [...directors, director]
    setDirectors(updated)
    localStorage.setItem('directors', JSON.stringify(updated))
    
    try {
      await addDoc(collection(db, 'directors'), director)
    } catch (error) {
      console.error('Error saving director to Firebase:', error)
    }
    
    setShowNewDirector(false)
    setNewDirector({
      id: '', name: '', position: '', signature: '', isActive: true
    })
  }

  const editDirector = (director: Director) => {
    setEditingDirector(director)
    setNewDirector({ ...director })
    setShowNewDirector(true)
  }

  const deleteDirector = async (directorId: string) => {
    if (confirm('Are you sure you want to delete this director?')) {
      const updated = directors.filter(d => d.id !== directorId)
      setDirectors(updated)
      localStorage.setItem('directors', JSON.stringify(updated))
      
      try {
        await deleteDoc(doc(db, 'directors', directorId))
      } catch (error) {
        console.error('Error deleting director from Firebase:', error)
      }
    }
  }

  const convertToInvoice = async (quotation: Quotation) => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      number: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quotationId: quotation.id,
      clientName: quotation.clientName,
      clientAddress: quotation.clientAddress,
      clientEmail: quotation.clientEmail,
      clientPhone: quotation.clientPhone,
      items: quotation.items,
      subtotal: quotation.subtotal,
      tax: quotation.tax,
      total: quotation.total,
      paidAmount: 0,
      status: 'sent',
      notes: quotation.notes
    }
    
    const updated = [...invoices, invoice]
    setInvoices(updated)
    localStorage.setItem('invoices', JSON.stringify(updated))
    
    // Save to Firebase
    try {
      await addDoc(collection(db, 'invoices'), invoice)
    } catch (error) {
      console.error('Error saving invoice to Firebase:', error)
    }
    
    // Update quotation status
    const updatedQuotations = quotations.map(q => 
      q.id === quotation.id ? { ...q, status: 'accepted' as const } : q
    )
    setQuotations(updatedQuotations)
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations))
    
    // Update quotation in Firebase
    try {
      await updateDoc(doc(db, 'quotations', quotation.id), { status: 'accepted' })
    } catch (error) {
      console.error('Error updating quotation status in Firebase:', error)
    }
    
    alert('Quotation converted to invoice successfully!')
  }

  const markAsPaid = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return
    
    const updated = invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, paidAmount: inv.total, status: 'paid' as const } : inv
    )
    setInvoices(updated)
    localStorage.setItem('invoices', JSON.stringify(updated))
    
    // Update in Firebase
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), { paidAmount: invoice.total, status: 'paid' })
    } catch (error) {
      console.error('Error updating invoice status in Firebase:', error)
    }
    
    alert('Invoice marked as paid!')
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

  const generateQuotationPDF = async (quotation: Quotation, preview: boolean = false) => {
    const doc = new jsPDF()
    let y = 15

    try {
      // Modern header with accent color - extended height
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 50, 'F')
      
      // Logo - positioned in header
      if (companyInfo.logo) {
        try {
          const logoData = await loadImageAsBase64(companyInfo.logo)
          if (logoData) {
            doc.addImage(logoData, 'JPEG', 15, y + 5, 35, 35)
          }
        } catch (e) {
          console.error('Error loading logo:', e)
        }
      }

      // Company name - white text in header
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text(companyInfo.name, 60, y + 15)
      
      // Company address - smaller white text below name
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      doc.text(companyInfo.address, 60, y + 22)
      doc.text(`Phone: ${companyInfo.phone} | Email: ${companyInfo.email}`, 60, y + 27)
      doc.text(`GST: ${companyInfo.gstNumber}`, 60, y + 32)
      
      // Reset text color
      doc.setTextColor(0, 0, 0)
      y = 60

      // Quotation header - modern design
      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      doc.text('QUOTATION', 15, y)
      y += 12

      // Quotation details in a box
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.rect(120, y - 8, 75, 25)
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Quotation #: ${quotation.number}`, 125, y + 2)
      doc.text(`Date: ${quotation.date}`, 125, y + 8)
      doc.text(`Status: ${quotation.status.toUpperCase()}`, 125, y + 14)
      y += 20

      // Bill To section
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Bill To:', 15, y)
      y += 8

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(quotation.clientName, 15, y)
      y += 6
      doc.text(quotation.clientAddress, 15, y)
      y += 6
      doc.text(`${quotation.clientEmail} | ${quotation.clientPhone}`, 15, y)
      y += 15

      // Items table header with background
      doc.setFillColor(245, 247, 250)
      doc.rect(15, y - 5, 180, 10, 'F')
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Description', 15, y)
      doc.text('Qty', 120, y)
      doc.text('Rate', 140, y)
      doc.text('Amount', 170, y)
      y += 12

      // Table border
      doc.setDrawColor(200, 200, 200)
      doc.line(15, y - 14, 195, y - 14)

      quotation.items.forEach(item => {
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        const descLines = doc.splitTextToSize(item.description, 100)
        descLines.forEach((line: string, i: number) => {
          doc.text(line, 15, y + (i * 5))
        })
        doc.text(item.quantity.toString(), 120, y)
        doc.text(`MVR ${item.rate.toFixed(2)}`, 140, y)
        doc.text(`MVR ${item.amount.toFixed(2)}`, 170, y)
        y += Math.max(12, descLines.length * 5 + 4)
      })

      // Bottom border
      doc.line(15, y - 2, 195, y - 2)
      y += 10

      // Totals section with background - wider for amount
      doc.setFillColor(245, 247, 250)
      doc.rect(110, y - 5, 85, 30, 'F')
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text('Subtotal:', 115, y + 2)
      doc.text(`MVR ${quotation.subtotal.toFixed(2)}`, 175, y + 2)
      y += 7
      doc.text('Tax:', 115, y)
      doc.text(`MVR ${quotation.tax.toFixed(2)}`, 175, y)
      y += 8
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Total:', 115, y)
      doc.text(`MVR ${quotation.total.toFixed(2)}`, 175, y)
      doc.setFont(undefined, 'normal')
      y += 15

      // Notes section
      if (quotation.notes) {
        doc.setFontSize(10)
        doc.setFont(undefined, 'bold')
        doc.text('Notes:', 15, y)
        y += 6
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        const noteLines = doc.splitTextToSize(quotation.notes, 170)
        noteLines.forEach((line: string) => {
          doc.text(line, 15, y)
          y += 5
        })
      }

      // Signature and stamp at absolute bottom - moved up
      y = 250
      doc.line(15, y - 10, 80, y - 10)
      
      // Use selected director's signature or default company signature
      let signaturePath = companyInfo.signature
      let signerName = companyInfo.managingDirector || 'Aboobakuru Gasim'
      let signerTitle = 'Managing Director'
      
      if (quotation.directorId) {
        const selectedDirector = directors.find(d => d.id === quotation.directorId)
        if (selectedDirector) {
          signaturePath = selectedDirector.signature
          signerName = selectedDirector.name
          signerTitle = selectedDirector.position
        }
      }
      
      if (signaturePath) {
        try {
          const signatureData = await loadImageAsBase64(signaturePath)
          if (signatureData) {
            // Keep aspect ratio - use original dimensions
            doc.addImage(signatureData, 'JPEG', 15, y - 40, 60, 30)
          }
        } catch (e) {
          console.error('Error loading signature:', e)
        }
      }
      
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')
      doc.text(signerName, 15, y + 5)
      doc.setFontSize(8)
      doc.setFont(undefined, 'normal')
      doc.text(signerTitle, 15, y + 10)

      if (companyInfo.registryStamp) {
        try {
          const stampData = await loadImageAsBase64(companyInfo.registryStamp)
          if (stampData) {
            doc.addImage(stampData, 'PNG', 135, y - 35, 45, 45)
          }
        } catch (e) {
          console.error('Error loading stamp:', e)
        }
      }

      if (preview) {
        const pdfBlob = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfBlob)
        console.log('PDF generated successfully, blob URL created')
        return blobUrl
      } else {
        doc.save(`Quotation-${quotation.number}.pdf`)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      if (preview) {
        const pdfBlob = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfBlob)
        console.log('PDF generated with error, blob URL created')
        return blobUrl
      } else {
        doc.save(`Quotation-${quotation.number}.pdf`)
      }
    }
  }

  const generateInvoicePDF = async (invoice: Invoice, preview: boolean = false) => {
    const doc = new jsPDF()
    let y = 15

    try {
      // Modern header with accent color - extended height
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 50, 'F')
      
      // Logo - positioned in header
      if (companyInfo.logo) {
        try {
          const logoData = await loadImageAsBase64(companyInfo.logo)
          if (logoData) {
            doc.addImage(logoData, 'JPEG', 15, y + 5, 35, 35)
          }
        } catch (e) {
          console.error('Error loading logo:', e)
        }
      }

      // Company name - white text in header
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text(companyInfo.name, 60, y + 15)
      
      // Company address - smaller white text below name
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      doc.text(companyInfo.address, 60, y + 22)
      doc.text(`Phone: ${companyInfo.phone} | Email: ${companyInfo.email}`, 60, y + 27)
      doc.text(`GST: ${companyInfo.gstNumber}`, 60, y + 32)
      
      // Reset text color
      doc.setTextColor(0, 0, 0)
      y = 60

      // Invoice header - modern design
      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      doc.text('INVOICE', 15, y)
      y += 12

      // Invoice details in a box
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.rect(120, y - 8, 75, 32)
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Invoice #: ${invoice.number}`, 125, y + 2)
      doc.text(`Date: ${invoice.date}`, 125, y + 8)
      doc.text(`Due Date: ${invoice.dueDate}`, 125, y + 14)
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 125, y + 20)
      y += 25

      // Bill To section
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Bill To:', 15, y)
      y += 8

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(invoice.clientName, 15, y)
      y += 6
      doc.text(invoice.clientAddress, 15, y)
      y += 6
      doc.text(`${invoice.clientEmail} | ${invoice.clientPhone}`, 15, y)
      y += 15

      // Items table header with background
      doc.setFillColor(245, 247, 250)
      doc.rect(15, y - 5, 180, 10, 'F')
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Description', 15, y)
      doc.text('Qty', 120, y)
      doc.text('Rate', 140, y)
      doc.text('Amount', 170, y)
      y += 12

      // Table border
      doc.setDrawColor(200, 200, 200)
      doc.line(15, y - 14, 195, y - 14)

      invoice.items.forEach(item => {
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        const descLines = doc.splitTextToSize(item.description, 100)
        descLines.forEach((line: string, i: number) => {
          doc.text(line, 15, y + (i * 5))
        })
        doc.text(item.quantity.toString(), 120, y)
        doc.text(`MVR ${item.rate.toFixed(2)}`, 140, y)
        doc.text(`MVR ${item.amount.toFixed(2)}`, 170, y)
        y += Math.max(12, descLines.length * 5 + 4)
      })

      // Bottom border
      doc.line(15, y - 2, 195, y - 2)
      y += 10

      // Totals section with background - wider for amount
      doc.setFillColor(245, 247, 250)
      doc.rect(110, y - 5, 85, 40, 'F')
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text('Subtotal:', 115, y + 2)
      doc.text(`MVR ${invoice.subtotal.toFixed(2)}`, 175, y + 2)
      y += 7
      doc.text('Tax:', 115, y)
      doc.text(`MVR ${invoice.tax.toFixed(2)}`, 175, y)
      y += 7
      doc.text('Paid:', 115, y)
      doc.text(`MVR ${invoice.paidAmount.toFixed(2)}`, 175, y)
      y += 8
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Balance:', 115, y)
      doc.text(`MVR ${(invoice.total - invoice.paidAmount).toFixed(2)}`, 175, y)
      doc.setFont(undefined, 'normal')
      y += 15

      // Notes section
      if (invoice.notes) {
        doc.setFontSize(10)
        doc.setFont(undefined, 'bold')
        doc.text('Notes:', 15, y)
        y += 6
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        const noteLines = doc.splitTextToSize(invoice.notes, 170)
        noteLines.forEach((line: string) => {
          doc.text(line, 15, y)
          y += 5
        })
      }

      // Signature and stamp at absolute bottom - moved up
      y = 250
      doc.line(15, y - 10, 80, y - 10)
      
      if (companyInfo.signature) {
        try {
          const signatureData = await loadImageAsBase64(companyInfo.signature)
          if (signatureData) {
            // Keep aspect ratio - use original dimensions
            doc.addImage(signatureData, 'JPEG', 15, y - 40, 60, 30)
          }
        } catch (e) {
          console.error('Error loading signature:', e)
        }
      }
      
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')
      doc.text(companyInfo.managingDirector || 'Aboobakuru Gasim', 15, y + 5)
      doc.setFontSize(8)
      doc.setFont(undefined, 'normal')
      doc.text('Managing Director', 15, y + 10)

      if (companyInfo.registryStamp) {
        try {
          const stampData = await loadImageAsBase64(companyInfo.registryStamp)
          if (stampData) {
            doc.addImage(stampData, 'PNG', 135, y - 35, 45, 45)
          }
        } catch (e) {
          console.error('Error loading stamp:', e)
        }
      }

      if (preview) {
        const pdfBlob = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfBlob)
        console.log('Invoice PDF generated successfully, blob URL created')
        return blobUrl
      } else {
        doc.save(`Invoice-${invoice.number}.pdf`)
      }
    } catch (error) {
      console.error('Error generating invoice PDF:', error)
      if (preview) {
        const pdfBlob = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfBlob)
        console.log('Invoice PDF generated with error, blob URL created')
        return blobUrl
      } else {
        doc.save(`Invoice-${invoice.number}.pdf`)
      }
    }
  }

  const getShareableLink = (id: string, type: 'quotation' | 'invoice') => {
    return `${window.location.origin}/view-${type}/${id}`
  }

  const saveCompanyInfo = () => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo))
    alert('Company information saved!')
  }

  const previewQuotation = async (quotation: Quotation) => {
    setPreviewType('quotation')
    setPreviewData(quotation)
    setIsGeneratingPreview(true)
    setBlobUrl(null)
    setShowPreview(true)
    try {
      const url = await generateQuotationPDF(quotation, true)
      console.log('Preview URL received:', url ? 'Yes' : 'No')
      setBlobUrl(url || null)
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const previewInvoice = async (invoice: Invoice) => {
    setPreviewType('invoice')
    setPreviewData(invoice)
    setIsGeneratingPreview(true)
    setBlobUrl(null)
    setShowPreview(true)
    try {
      const url = await generateInvoicePDF(invoice, true)
      console.log('Preview URL received:', url ? 'Yes' : 'No')
      setBlobUrl(url || null)
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const downloadPDF = async () => {
    if (!previewData) return
    if (previewType === 'quotation') {
      await generateQuotationPDF(previewData as Quotation, false)
    } else {
      await generateInvoicePDF(previewData as Invoice, false)
    }
    setShowPreview(false)
  }

  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (imageCache[url]) {
        resolve(imageCache[url])
        return
      }

      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const dataUrl = canvas.toDataURL('image/png')
          // Cache the result
          setImageCache(prev => ({ ...prev, [url]: dataUrl }))
          resolve(dataUrl)
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })
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
          <Button
            variant={activeTab === 'customers' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('customers')}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Customers
          </Button>
          <Button
            variant={activeTab === 'terms' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('terms')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Terms
          </Button>
          <Button
            variant={activeTab === 'directors' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('directors')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Directors
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
                  <div>
                    <Label>Select Customer (Optional)</Label>
                    <select 
                      className="w-full mt-2 p-2 border rounded-md"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const customer = customers.find(c => c.id === e.target.value)
                          if (customer) selectCustomer(customer, 'quotation')
                        }
                      }}
                    >
                      <option value="">-- Select a customer --</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.name} {customer.company ? `(${customer.company})` : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Select Director for Signature (Optional)</Label>
                    <select 
                      className="w-full mt-2 p-2 border rounded-md"
                      value={newQuotation.directorId || ""}
                      onChange={(e) => {
                        setNewQuotation({ ...newQuotation, directorId: e.target.value })
                      }}
                    >
                      <option value="">-- Select a director --</option>
                      {directors.filter(d => d.isActive).map(director => (
                        <option key={director.id} value={director.id}>{director.name} - {director.position}</option>
                      ))}
                    </select>
                  </div>
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
                      <p className="text-sm text-gray-600">Subtotal: <span className="font-bold">MVR {newQuotation.subtotal?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Tax: <span className="font-bold">MVR {newQuotation.tax?.toFixed(2)}</span></p>
                      <p className="text-lg font-bold text-primary">Total: MVR {newQuotation.total?.toFixed(2)}</p>
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
                <Card key={q.id}><CardContent className="p-6"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h3 className="font-semibold">{q.number}</h3><p className="text-sm text-gray-600">{q.clientName}</p><p className="text-sm text-gray-600">{q.date}</p><p className="text-sm text-gray-600">Status: {q.status}</p><p className="text-lg font-bold text-primary">MVR {q.total.toFixed(2)}</p></div><div className="flex gap-2 flex-wrap"><Button size="sm" variant="outline" onClick={() => previewQuotation(q)}><Eye className="w-4 h-4 mr-2" />Preview</Button><Button size="sm" variant="outline" onClick={() => generateQuotationPDF(q)}><Download className="w-4 h-4 mr-2" />PDF</Button><Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(getShareableLink(q.id, 'quotation')); alert('Link copied!')}}><Share2 className="w-4 h-4 mr-2" />Share</Button><Button size="sm" variant="primary" onClick={() => convertToInvoice(q)} disabled={q.status === 'accepted'}><Receipt className="w-4 h-4 mr-2" />Convert to Invoice</Button></div></div></CardContent></Card>
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
                  <div>
                    <Label>Select Customer (Optional)</Label>
                    <select 
                      className="w-full mt-2 p-2 border rounded-md"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const customer = customers.find(c => c.id === e.target.value)
                          if (customer) selectCustomer(customer, 'invoice')
                        }
                      }}
                    >
                      <option value="">-- Select a customer --</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.name} {customer.company ? `(${customer.company})` : ''}</option>
                      ))}
                    </select>
                  </div>
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
                      <p className="text-sm text-gray-600">Subtotal: <span className="font-bold">MVR {newInvoice.subtotal?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Tax: <span className="font-bold">MVR {newInvoice.tax?.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Paid: <span className="font-bold">MVR {newInvoice.paidAmount?.toFixed(2)}</span></p>
                      <p className="text-lg font-bold text-primary">Balance: MVR {(newInvoice.total || 0 - (newInvoice.paidAmount || 0)).toFixed(2)}</p>
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
                        <p className="text-lg font-bold text-primary">MVR {inv.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Paid: MVR {inv.paidAmount.toFixed(2)} | Balance: MVR {(inv.total - inv.paidAmount).toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{inv.status.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => previewInvoice(inv)}><Eye className="w-4 h-4 mr-2" />Preview</Button>
                          <Button size="sm" variant="outline" onClick={() => generateInvoicePDF(inv)}><Download className="w-4 h-4 mr-2" />PDF</Button>
                          <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(getShareableLink(inv.id, 'invoice')); alert('Link copied!')}}><Share2 className="w-4 h-4 mr-2" />Share</Button>
                          {inv.status !== 'paid' && (
                            <Button size="sm" variant="primary" onClick={() => markAsPaid(inv.id)}><CheckCircle className="w-4 h-4 mr-2" />Mark as Paid</Button>
                          )}
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

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customers</h2>
              <Button onClick={() => setShowNewCustomer(true)}><Plus className="w-4 h-4 mr-2" />Add Customer</Button>
            </div>

            {showNewCustomer && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Customer name" /></div>
                    <div><Label>Company</Label><Input value={newCustomer.company || ''} onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})} placeholder="Company name" /></div>
                    <div><Label>Email *</Label><Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="email@example.com" /></div>
                    <div><Label>Phone *</Label><Input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="+960 1234567" /></div>
                  </div>
                  <div><Label>Address *</Label><Input value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="Full address" /></div>
                  <div><Label>GST Number</Label><Input value={newCustomer.gstNumber || ''} onChange={(e) => setNewCustomer({...newCustomer, gstNumber: e.target.value})} placeholder="GST number" /></div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowNewCustomer(false)
                      setEditingCustomer(null)
                      setNewCustomer({
                        id: '', name: '', address: '', email: '', phone: '', company: '', gstNumber: ''
                      })
                    }}>Cancel</Button>
                    <Button onClick={saveCustomer}>{editingCustomer ? 'Update Customer' : 'Save Customer'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((customer) => (
                <Card key={customer.id}>
                  <CardHeader>
                    <h3 className="font-semibold">{customer.name}</h3>
                    {customer.company && <p className="text-sm text-gray-600">{customer.company}</p>}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Email:</strong> {customer.email}</p>
                      <p><strong>Phone:</strong> {customer.phone}</p>
                      <p><strong>Address:</strong> {customer.address}</p>
                      {customer.gstNumber && <p><strong>GST:</strong> {customer.gstNumber}</p>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => editCustomer(customer)} className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteCustomer(customer.id)} className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {customers.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No customers added yet</p></CardContent></Card>}
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h2>
              <Button onClick={() => setShowNewTerm(true)}><Plus className="w-4 h-4 mr-2" />Add Term</Button>
            </div>

            {showNewTerm && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">{editingTerm ? 'Edit Term' : 'Add New Term'}</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Title *</Label><Input value={newTerm.title} onChange={(e) => setNewTerm({...newTerm, title: e.target.value})} placeholder="Term title" /></div>
                    <div><Label>Version</Label><Input value={newTerm.version} onChange={(e) => setNewTerm({...newTerm, version: e.target.value})} placeholder="1.0" /></div>
                    <div><Label>Effective Date</Label><Input type="date" value={newTerm.effectiveDate} onChange={(e) => setNewTerm({...newTerm, effectiveDate: e.target.value})} /></div>
                  </div>
                  <div><Label>Content *</Label><textarea 
                    className="w-full p-2 border rounded-md min-h-[150px]"
                    value={newTerm.content}
                    onChange={(e) => setNewTerm({...newTerm, content: e.target.value})}
                    placeholder="Enter terms and conditions content..."
                  /></div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowNewTerm(false)
                      setEditingTerm(null)
                      setNewTerm({
                        id: '', title: '', content: '', version: '1.0', effectiveDate: new Date().toISOString().split('T')[0]
                      })
                    }}>Cancel</Button>
                    <Button onClick={saveTerm}>{editingTerm ? 'Update Term' : 'Save Term'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {terms.map((term) => (
                <Card key={term.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{term.title}</h3>
                        <p className="text-sm text-gray-600">Version: {term.version} | Effective: {term.effectiveDate}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{term.content.substring(0, 200)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editTerm(term)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => deleteTerm(term.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {terms.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No terms added yet</p></CardContent></Card>}
            </div>
          </div>
        )}

        {activeTab === 'directors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Board of Directors</h2>
              <Button onClick={() => setShowNewDirector(true)}><Plus className="w-4 h-4 mr-2" />Add Director</Button>
            </div>

            {showNewDirector && (
              <Card className="mb-6">
                <CardHeader><h3 className="text-lg font-bold">{editingDirector ? 'Edit Director' : 'Add New Director'}</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={newDirector.name} onChange={(e) => setNewDirector({...newDirector, name: e.target.value})} placeholder="Director name" /></div>
                    <div><Label>Position *</Label><Input value={newDirector.position} onChange={(e) => setNewDirector({...newDirector, position: e.target.value})} placeholder="e.g., Managing Director" /></div>
                    <div><Label>Signature Path *</Label><Input value={newDirector.signature} onChange={(e) => setNewDirector({...newDirector, signature: e.target.value})} placeholder="/path/to/signature.jpeg" /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={newDirector.isActive} onChange={(e) => setNewDirector({...newDirector, isActive: e.target.checked})} />
                      <Label htmlFor="isActive">Active (can sign quotations)</Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowNewDirector(false)
                      setEditingDirector(null)
                      setNewDirector({
                        id: '', name: '', position: '', signature: '', isActive: true
                      })
                    }}>Cancel</Button>
                    <Button onClick={saveDirector}>{editingDirector ? 'Update Director' : 'Save Director'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {directors.map((director) => (
                <Card key={director.id}>
                  <CardHeader>
                    <h3 className="font-semibold">{director.name}</h3>
                    <p className="text-sm text-gray-600">{director.position}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Signature:</strong> {director.signature}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${director.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {director.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => editDirector(director)} className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteDirector(director.id)} className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {directors.length === 0 && <Card><CardContent className="p-12 text-center"><p className="text-gray-600">No directors added yet</p></CardContent></Card>}
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {showPreview && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">PDF Preview - {previewType === 'quotation' ? 'Quotation' : 'Invoice'}</h2>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {isGeneratingPreview ? (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating PDF preview...</p>
                    </div>
                  </div>
                ) : blobUrl ? (
                  <iframe
                    src={blobUrl}
                    className="w-full h-[600px] border"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[600px]">
                    <p className="text-gray-600">No preview available</p>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
                  <Button onClick={downloadPDF} disabled={isGeneratingPreview}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
