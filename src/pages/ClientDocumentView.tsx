import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FileText, Receipt, Download, ArrowLeft, Home } from 'lucide-react'
import jsPDF from 'jspdf'

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

interface CompanyInfo {
  name: string
  logo: string
  address: string
  gstNumber: string
  registryStamp: string
  phone: string
  email: string
}

export function ClientDocumentView() {
  const { type, id } = useParams<{ type: 'quotation' | 'invoice', id: string }>()
  const [document, setDocument] = useState<Quotation | Invoice | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDocument = () => {
      try {
        const savedCompany = localStorage.getItem('companyInfo')
        if (savedCompany) {
          setCompanyInfo(JSON.parse(savedCompany))
        }

        if (type === 'quotation') {
          const quotations = localStorage.getItem('quotations')
          if (quotations) {
            const quotationList: Quotation[] = JSON.parse(quotations)
            const found = quotationList.find(q => q.id === id)
            if (found) {
              setDocument(found)
            } else {
              setError('Quotation not found')
            }
          }
        } else if (type === 'invoice') {
          const invoices = localStorage.getItem('invoices')
          if (invoices) {
            const invoiceList: Invoice[] = JSON.parse(invoices)
            const found = invoiceList.find(inv => inv.id === id)
            if (found) {
              setDocument(found)
            } else {
              setError('Invoice not found')
            }
          }
        }
      } catch (err) {
        setError('Error loading document')
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [type, id])

  const generatePDF = () => {
    if (!document || !companyInfo) return

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
    const title = type === 'quotation' ? 'QUOTATION' : 'INVOICE'
    doc.text(title, 150, y)
    y += 10

    doc.setFontSize(12)
    const number = type === 'quotation' ? (document as Quotation).number : (document as Invoice).number
    const date = (document as Quotation | Invoice).date
    doc.text(`${type === 'quotation' ? 'Quotation' : 'Invoice'} #: ${number}`, 150, y)
    y += 7
    doc.text(`Date: ${date}`, 150, y)
    if (type === 'invoice') {
      doc.text(`Due Date: ${(document as Invoice).dueDate}`, 150, y)
      y += 7
    }
    y += 15

    doc.setFontSize(14)
    doc.text('Bill To:', 20, y)
    y += 10

    doc.setFontSize(11)
    doc.text(document.clientName, 20, y)
    y += 7
    doc.text(document.clientAddress, 20, y)
    y += 7
    doc.text(`Email: ${document.clientEmail}`, 20, y)
    y += 7
    doc.text(`Phone: ${document.clientPhone}`, 20, y)
    y += 15

    doc.setFontSize(12)
    doc.text('Description', 20, y)
    doc.text('Qty', 120, y)
    doc.text('Rate', 140, y)
    doc.text('Amount', 170, y)
    y += 5

    doc.line(20, y, 190, y)
    y += 10

    document.items.forEach(item => {
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
    doc.text(`$${document.subtotal.toFixed(2)}`, 170, y)
    y += 7
    doc.text('Tax:', 130, y)
    doc.text(`$${document.tax.toFixed(2)}`, 170, y)
    y += 7

    if (type === 'invoice') {
      doc.text('Paid:', 130, y)
      doc.text(`$${(document as Invoice).paidAmount.toFixed(2)}`, 170, y)
      y += 7
      doc.setFontSize(14)
      doc.text('Balance Due:', 130, y)
      doc.text(`$${((document as Invoice).total - (document as Invoice).paidAmount).toFixed(2)}`, 170, y)
    } else {
      doc.setFontSize(14)
      doc.text('Total:', 130, y)
      doc.text(`$${document.total.toFixed(2)}`, 170, y)
    }
    y += 15

    if (document.notes) {
      doc.setFontSize(10)
      doc.text('Notes:', 20, y)
      y += 7
      const noteLines = doc.splitTextToSize(document.notes, 170)
      noteLines.forEach((line: string) => {
        doc.text(line, 20, y)
        y += 5
      })
    }

    if (companyInfo.registryStamp) {
      doc.addImage(companyInfo.registryStamp, 'PNG', 140, y - 20, 40, 40)
    }

    doc.save(`${type === 'quotation' ? 'Quotation' : 'Invoice'}-${number}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Document Not Found</h1>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{error || 'The requested document could not be found.'}</p>
            <Link to="/">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {type === 'quotation' ? <FileText className="w-8 h-8 text-blue-500" /> : <Receipt className="w-8 h-8 text-green-500" />}
                <div>
                  <h1 className="text-2xl font-bold">{type === 'quotation' ? 'Quotation' : 'Invoice'}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{document.number}</p>
                </div>
              </div>
              <Button onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {companyInfo && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">From:</h3>
                <p className="text-gray-900 dark:text-white font-medium">{companyInfo.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{companyInfo.address}</p>
                <p className="text-gray-600 dark:text-gray-400">Phone: {companyInfo.phone}</p>
                <p className="text-gray-600 dark:text-gray-400">Email: {companyInfo.email}</p>
                <p className="text-gray-600 dark:text-gray-400">GST: {companyInfo.gstNumber}</p>
              </div>
            )}

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="text-gray-900 dark:text-white font-medium">{document.clientName}</p>
              <p className="text-gray-600 dark:text-gray-400">{document.clientAddress}</p>
              <p className="text-gray-600 dark:text-gray-400">Email: {document.clientEmail}</p>
              <p className="text-gray-600 dark:text-gray-400">Phone: {document.clientPhone}</p>
            </div>

            <div className="border-b pb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Date</p>
                  <p className="font-medium">{document.date}</p>
                </div>
                {type === 'invoice' && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Due Date</p>
                    <p className="font-medium">{(document as Invoice).dueDate}</p>
                  </div>
                )}
              </div>
              {type === 'invoice' && (
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium">
                  Status: {document.status.toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-4">Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Rate</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                        <td className="p-3 text-right">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${document.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${document.tax.toFixed(2)}</span>
                </div>
                {type === 'invoice' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-medium">${(document as Invoice).paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Balance Due:</span>
                      <span className="text-primary">${((document as Invoice).total - (document as Invoice).paidAmount).toFixed(2)}</span>
                    </div>
                  </>
                )}
                {type === 'quotation' && (
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">${document.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {document.notes && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-gray-600 dark:text-gray-400">{document.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
