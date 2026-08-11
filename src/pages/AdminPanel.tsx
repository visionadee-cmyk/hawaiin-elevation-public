import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/label'
import { Lock, FileText, Receipt, CheckCircle, Share2, Download, Plus, Building2, LogOut, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf'

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

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotations' | 'invoices' | 'company'>('dashboard')
  const [companyInfo, setCompanyInfo] = useState({
    name: '', logo: '', address: '', gstNumber: '', registryStamp: '', phone: '', email: ''
  })
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showNewQuotation, setShowNewQuotation] = useState(false)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const [newQuotation, setNewQuotation] = useState<Quotation>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], clientName: '', clientAddress: '',
    clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0, notes: '', status: 'draft'
  })

  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: '', number: '', date: new Date().toISOString().split('T')[0], dueDate: '', clientName: '',
    clientAddress: '', clientEmail: '', clientPhone: '', items: [], subtotal: 0, tax: 0, total: 0,
    paidAmount: 0, notes: '', status: 'draft'
  })

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    loadData()
  }, [])

  const loadData = () => {
    const savedCompany = localStorage.getItem('companyInfo')
    if (savedCompany) setCompanyInfo(JSON.parse(savedCompany))

    const savedQuotations = localStorage.getItem('quotations')
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations) as Quotation[])

    const savedInvoices = localStorage.getItem('invoices')
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices) as Invoice[])
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
      doc.addImage(companyInfo.logo, 'PNG', 20, y, 40, 40)
      y += 50
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

    if (companyInfo.registryStamp) {
      doc.addImage(companyInfo.registryStamp, 'PNG', 140, y - 20, 40, 40)
    }

    doc.save(`Quotation-${quotation.number}.pdf`)
  }

  const generateInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF()
    let y = 20

    if (companyInfo.logo) {
      doc.addImage(companyInfo.logo, 'PNG', 20, y, 40, 40)
      y += 50
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
    doc.text('Balance Due:', 130, y)
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

    if (companyInfo.registryStamp) {
      doc.addImage(companyInfo.registryStamp, 'PNG', 140, y - 20, 40, 40)
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
                    <Button size="sm" variant="outline" onClick={() => addLineItem('quotation')} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
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
                    <Button size="sm" variant="outline" onClick={() => addLineItem('invoice')} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
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
              <div><Label>Logo URL</Label><Input value={companyInfo.logo} onChange={(e) => setCompanyInfo({...companyInfo, logo: e.target.value})} placeholder="https://example.com/logo.png" /></div>
              <div><Label>Registry Stamp URL</Label><Input value={companyInfo.registryStamp} onChange={(e) => setCompanyInfo({...companyInfo, registryStamp: e.target.value})} placeholder="https://example.com/stamp.png" /></div>
              <Button onClick={saveCompanyInfo}>Save Company Information</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
