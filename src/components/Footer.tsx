import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.jpeg" alt="Hawaiin Elevation" className="h-10 w-10 rounded-lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Hawaiin Elevation</span>
                <span className="text-xs text-secondary font-medium">LET US FIX</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your complete digital services platform. Create professional documents, websites, resumes, and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">YouTube</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/cv-builder" className="text-gray-400 hover:text-white transition-colors text-sm">CV Builder</Link></li>
              <li><Link to="/cover-letter" className="text-gray-400 hover:text-white transition-colors text-sm">Cover Letter</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors text-sm">Portfolio Builder</Link></li>
              <li><Link to="/website-builder" className="text-gray-400 hover:text-white transition-colors text-sm">Website Builder</Link></li>
              <li><Link to="/ai-tools" className="text-gray-400 hover:text-white transition-colors text-sm">AI Tools</Link></li>
              <li><Link to="/graphics" className="text-gray-400 hover:text-white transition-colors text-sm">Graphic Design</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400 text-sm">info@hawaiinelevation.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Business Ave, Suite 100</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Hawaiin Elevation. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
