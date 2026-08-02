import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { SEO } from './components/SEO'
import { Analytics } from './components/Analytics'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CustomerDashboard } from './pages/CustomerDashboard'
import { CVBuilder } from './pages/CVBuilder'
import { AITools } from './pages/AITools'
import { AdminDashboard } from './pages/AdminDashboard'
import { CoverLetterBuilder } from './pages/CoverLetterBuilder'
import { JobEmailBuilder } from './pages/JobEmailBuilder'
import { PortfolioBuilder } from './pages/PortfolioBuilder'
import { PersonalWebsiteBuilder } from './pages/PersonalWebsiteBuilder'
import { CompanyWebsiteBuilder } from './pages/CompanyWebsiteBuilder'
import { CompanyProfileBuilder } from './pages/CompanyProfileBuilder'
import { BusinessProposalBuilder } from './pages/BusinessProposalBuilder'
import { GraphicDesignTools } from './pages/GraphicDesignTools'
import { Services3D } from './pages/Services3D'
import { OrderSystem } from './pages/OrderSystem'
import { LiveChat } from './pages/LiveChat'
import { Blog } from './pages/Blog'
import { ContactPage } from './pages/ContactPage'
import { PaymentSystem } from './pages/PaymentSystem'
import { WebApps } from './pages/WebApps'
import { LogoPortfolio } from './pages/LogoPortfolio'
import { Images3DPortfolio } from './pages/Images3DPortfolio'
import { Videos3DPortfolio } from './pages/Videos3DPortfolio'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SEO />
          <Analytics trackingId={import.meta.env.VITE_GA_TRACKING_ID} />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/cv-builder" element={<CVBuilder />} />
                <Route path="/cover-letter" element={<CoverLetterBuilder />} />
                <Route path="/job-email" element={<JobEmailBuilder />} />
                <Route path="/portfolio" element={<PortfolioBuilder />} />
                <Route path="/personal-website" element={<PersonalWebsiteBuilder />} />
                <Route path="/company-website" element={<CompanyWebsiteBuilder />} />
                <Route path="/company-profile" element={<CompanyProfileBuilder />} />
                <Route path="/business-proposal" element={<BusinessProposalBuilder />} />
                <Route path="/graphic-design" element={<GraphicDesignTools />} />
                <Route path="/graphics" element={<GraphicDesignTools />} />
                <Route path="/3d-services" element={<Services3D />} />
                <Route path="/order" element={<OrderSystem />} />
                <Route path="/chat" element={<LiveChat />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact-page" element={<ContactPage />} />
                <Route path="/payment" element={<PaymentSystem />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/webapps" element={<WebApps />} />
                <Route path="/website-builder" element={<PersonalWebsiteBuilder />} />
                <Route path="/logo-portfolio" element={<LogoPortfolio />} />
                <Route path="/3d-images" element={<Images3DPortfolio />} />
                <Route path="/3d-videos" element={<Videos3DPortfolio />} />
                {/* Landing page sections */}
                <Route path="/pricing" element={<LandingPage />} />
                <Route path="/services" element={<LandingPage />} />
                <Route path="/about" element={<LandingPage />} />
                <Route path="/contact" element={<LandingPage />} />
                {/* Add more routes as we build them */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
