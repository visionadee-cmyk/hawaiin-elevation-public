import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  MessageSquare
} from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">info@hawaiinelevation.com</p>
                    <p className="text-gray-600 dark:text-gray-400">support@hawaiinelevation.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 987-6543</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Address</h4>
                    <p className="text-gray-600 dark:text-gray-400">123 Business Avenue</p>
                    <p className="text-gray-600 dark:text-gray-400">Honolulu, HI 96801</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Business Hours</h4>
                    <p className="text-gray-600 dark:text-gray-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Sat - Sun: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Follow Us</h3>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <span className="font-bold">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
                    <span className="font-bold">X</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                    <span className="font-bold">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <span className="font-bold">ig</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Links</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      Our Services
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Send us a Message</h3>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How quickly do you respond to inquiries?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Do you offer free consultations?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Yes, we offer a free 30-minute consultation for new clients. Contact us to schedule.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What services do you offer?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We offer CV building, website creation, graphic design, 3D services, and more. Check our Services page for details.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Can I request a custom service?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Absolutely! Contact us with your requirements and we'll discuss how we can help.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
