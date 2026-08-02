import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Star, Zap, Shield, Globe, Clock, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function LandingPage() {
  const location = useLocation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [employeeSlide, setEmployeeSlide] = useState(0)

  const carouselImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHkjt3ZCEX8_zZrfEk8vM5HPqNzsSzcYFLZXNNZTvIxA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFewokNFiGZFjhTespbHHna3ODd7y5xQS-q_frC90AjQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRARjzCKK8McTgpOsXXpYC4wy8Ep4I11jPR8D8puPjaVw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsIgMQ1f2oh8QChj5WOk1P987pX1qynlTW9wpqLPhlyw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwSRtdG2uTKAkddCvVtkiqUs5A8LHjzBCliZ7zvx_mvg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmeZ8xFWuekSdU7b3L0XTeQ6pq6_ZYHEEj_Ctr2oh-Ug&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL8HFxLjhTec-7_vfuCdmpVvJ2CL-SHEF3tGgDvShknA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-OwlCd84ybcuSz9Du5npwFcZRvRRPQEfbJ464AbgxXg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmUhJQTc43-Oj-KcBMJM6-5GTU0w47ndaJYXX3nKjp7g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLAIq1csJYrFydMvV_v6nU0di_BxvsKtzQYNNoqvpR9g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm-94no7oaIcCFg7UEKu6KllilekxPPVWbJaUzuee9dg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTstMZiYroaMpjGc0Dq2tsKuFEFQEAInyMf2bCWtT4WFA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHcJKCYXluSMtZ0PJH05zYb6g7kmNG_JOFJPU7sNpjCQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXp-rtT67wEHiqnz6q02FwWNTvSE39bsgpI4DCSFLCkQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC1h7_CWCvtbVwxnVqot-S5BcNE3klLvvak3q8OB79Hg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OPiUssQv0-rOQEt3Hy_Lv0HE2QTxAReIxl1RLQCgSw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIRvcAtWCo3wI7JiYyIemoNAIUnMjXaR3W0YWgMQ-OvQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2yJpT3ghe4fe1gs9O5DaqLPDLYeQKffUy7MGGVLS8ZQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYMGPP1okIz4JxXB8uVL1aRHzri5pQ1O2NwuZRjims7Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY_mIdRyjQXk4Y1x3i_rEQP0PkmdO4N4pAc1DZIHNhw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLFeHfPe5x0hKPP8NVB2r69xDc4SIch-iQTLLmJa2Pxw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG7tmIPANOfQRbDRmG7dIaF0E1ECB0IvgWNe7b3i0ZKQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWygkOuKwg14_6iZpOHgJjzT06tmKAsU-sXmRMCIizg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8aV4U8A0UveD8IfKybz7qOM9qWSNa-8uirNHjBTkghg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS44oQezkLMw8gA_Td0WYiO8oyQyPKeLxkz5eQ7S7Wlqw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwTDEa597kANLqFBGWs8f-2heoC8MEcTZASfijRX2uYw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXms2kwdhIcMfM2IfF4CTjgRoBQoziXrSKUeyBRCn9A&s=10',
  ]

  const employeePortfolioImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWygkOuKwg14_6iZpOHgJjzT06tmKAsU-sXmRMCIizg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8aV4U8A0UveD8IfKybz7qOM9qWSNa-8uirNHjBTkghg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS44oQezkLMw8gA_Td0WYiO8oyQyPKeLxkz5eQ7S7Wlqw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwTDEa597kANLqFBGWs8f-2heoC8MEcTZASfijRX2uYw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXms2kwdhIcMfM2IfF4CTjgRoBQoziXrSKUeyBRCn9A&s=10',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(carouselImages.length / 4))
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setEmployeeSlide((prev) => (prev + 1) % Math.ceil(employeePortfolioImages.length / 4))
    }, 4000)
    return () => clearInterval(interval)
  }, [employeePortfolioImages.length])

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (location.pathname === '/services') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    } else if (location.pathname === '/pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    } else if (location.pathname === '/about') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    } else if (location.pathname === '/contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])
  const services = [
    { icon: '📄', title: 'CV Builder', description: 'Create professional resumes with ATS-friendly templates', link: '/cv-builder' },
    { icon: '✉️', title: 'Cover Letter', description: 'AI-powered cover letters that get you hired', link: '/cover-letter' },
    { icon: '🌐', title: 'Website Builder', description: 'Build stunning websites without coding', link: '/website-builder' },
    { icon: '💼', title: 'Portfolio', description: 'Showcase your work beautifully', link: '/portfolio' },
    { icon: '🤖', title: 'AI Tools', description: 'Smart AI assistance for all your needs', link: '/ai-tools' },
    { icon: '🎨', title: 'Graphics', description: 'Professional design tools for everyone', link: '/graphics' },
  ]

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Create documents in minutes, not hours' },
    { icon: Shield, title: 'Secure & Private', description: 'Your data is protected with enterprise-grade security' },
    { icon: Globe, title: 'Global Access', description: 'Access your work from anywhere in the world' },
    { icon: Clock, title: '24/7 Support', description: 'Our team is always here to help you' },
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Marketing Manager', content: 'Hawaiin Elevation transformed my job search. I got 3 interviews in my first week!', rating: 5 },
    { name: 'Michael Chen', role: 'Software Engineer', content: 'The CV builder is incredible. Clean, professional, and easy to use.', rating: 5 },
    { name: 'Emily Davis', role: 'Freelancer', content: 'I built my portfolio website in one day. Absolutely amazing!', rating: 5 },
  ]

  const featuredApps = [
    {
      name: 'Park BBQ Kitchen',
      description: 'Booking system for Park BBQ Kitchen events',
      image: 'https://parkbbqkitchen.hawadaily.com/logo/logo.jpeg',
      link: 'https://parkbbqkitchen.hawadaily.com/'
    },
    {
      name: 'Hawa Daily',
      description: 'Modern Maldives news portal with Dhivehi RTL support',
      image: 'https://www.hawadaily.com/logo.png',
      link: 'https://www.hawadaily.com/'
    },
    {
      name: 'Maa Wadi Mv',
      description: 'Smart furniture planning tool with instant pricing',
      image: 'https://maa-wadi-mv.vercel.app/assets/logo.png',
      link: 'https://maa-wadi-mv.vercel.app/'
    }
  ]

  const portfolio3DImages = [
    '/3d images/Blender_Image_(1).jpg',
    '/3d images/Blender_Image_(2).jpg',
    '/3d images/Blender_Image_(3).jpg',
    '/3d images/Blender_Image_(4).jpg',
    '/3d images/Blender_Image_(5).jpg',
    '/3d images/Blender_Image_(6).jpg',
    '/3d images/Blender_Image_(7).jpg',
    '/3d images/Blender_Image_(8).jpg',
    '/3d images/Blender_Image_(9).jpg',
    '/3d images/Blender_Image_(10).jpg',
    '/3d images/Blender_Image_(11).jpg',
    '/3d images/Blender_Image_(12).jpg',
  ]

  const portfolio3DVideos = [
    { name: 'Maabinhura', src: '/3d video/Maabinhura_.mov' },
    { name: 'New Normal Dining', src: '/3d video/New_Normal_dining.mov' },
    { name: 'Fareast Upscale', src: '/3d video/fareast_upscale.mp4' },
    { name: 'Independence', src: '/3d video/independence.mov' },
  ]

  const logos = [
    '/logo/logo.png',
    '/logo/logo (1).png',
    '/logo/logo (2).png',
    '/logo/logo (3).png',
    '/logo/logo (4).png',
    '/logo/logo (5).png',
  ]

  const pricing = [
    { name: 'Free', price: '$0', features: ['Basic CV Templates', '1 Project', 'PDF Download', 'Community Support'], popular: false },
    { name: 'Starter', price: '$9', features: ['All Templates', '10 Projects', 'PDF & Word Export', 'Priority Support', 'AI Suggestions'], popular: true },
    { name: 'Professional', price: '$19', features: ['Unlimited Projects', 'Custom Branding', 'Website Builder', 'AI Suite', 'Priority Support'], popular: false },
  ]

  const faqs = [
    { question: 'Is Hawaiin Elevation free to use?', answer: 'Yes! We offer a generous free plan with essential features. Upgrade to unlock premium templates and advanced features.' },
    { question: 'Can I cancel my subscription anytime?', answer: 'Absolutely! You can cancel your subscription at any time with no questions asked.' },
    { question: 'Are my documents secure?', answer: 'Yes, we use enterprise-grade encryption and security measures to protect your data.' },
    { question: 'Can I use this for commercial purposes?', answer: 'Yes, all documents created on our platform can be used for personal and commercial purposes.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/3d video/fareast_upscale.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Badge variant="info" className="mb-4 bg-white/20 text-white backdrop-blur-sm">🚀 Trusted by 50,000+ professionals</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              LET US FIX
              <span className="block text-primary">Your Digital Presence</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Create professional CVs, websites, portfolios, and more with our all-in-one digital services platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Work</h2>
            <p className="text-gray-600 dark:text-gray-400">Explore our latest projects and designs</p>
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="w-1/4 flex-shrink-0 p-2">
                  <img 
                    src={image} 
                    alt={`Slide ${index + 1}`} 
                    className="w-full h-[300px] object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
                  />
                </div>
              ))}
            </div>
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {Array.from({ length: Math.ceil(carouselImages.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online Employee Portfolio Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Employee Portfolios</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Online Employee Portfolios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Showcase your professional journey with our comprehensive portfolio solutions
            </p>
          </div>

          {/* Portfolio Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: '👤',
                title: 'Professional Profile',
                description: 'Create stunning personal profiles with photos, bio, and contact information',
                features: ['Photo Gallery', 'Bio Section', 'Contact Info', 'Social Links']
              },
              {
                icon: '💼',
                title: 'Work Experience',
                description: 'Highlight your career journey with detailed work history and achievements',
                features: ['Timeline View', 'Company Logos', 'Key Achievements', 'Skills Tags']
              },
              {
                icon: '🎓',
                title: 'Education & Certifications',
                description: 'Display your academic background and professional certifications',
                features: ['Degree Display', 'Certificate Badges', 'Institution Info', 'Graduation Dates']
              },
              {
                icon: '🚀',
                title: 'Projects Showcase',
                description: 'Present your best work with images, descriptions, and links',
                features: ['Project Gallery', 'Case Studies', 'Live Demos', 'Client Testimonials']
              },
              {
                icon: '📊',
                title: 'Skills & Expertise',
                description: 'Visual representation of your technical and soft skills',
                features: ['Skill Bars', 'Technology Icons', 'Proficiency Levels', 'Category Groups']
              },
              {
                icon: '📝',
                title: 'Resume Integration',
                description: 'Seamlessly integrate your CV with downloadable options',
                features: ['PDF Download', 'Print Friendly', 'Multiple Templates', 'ATS Optimized']
              }
            ].map((section, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {section.description}
                  </p>
                  <ul className="space-y-2">
                    {section.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-12">
            <Link to="/portfolio-builder">
              <Button size="lg">
                Build Your Portfolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Employee Portfolio Image Carousel */}
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${employeeSlide * 25}%)` }}
            >
              {employeePortfolioImages.map((image, index) => (
                <div key={index} className="w-1/4 flex-shrink-0 p-2">
                  <img 
                    src={image} 
                    alt={`Employee Portfolio ${index + 1}`} 
                    className="w-full h-[300px] object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
                  />
                </div>
              ))}
            </div>
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {Array.from({ length: Math.ceil(employeePortfolioImages.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setEmployeeSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    employeeSlide === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: '50K+' },
              { label: 'Documents Created', value: '1M+' },
              { label: 'Success Rate', value: '95%' },
              { label: 'Countries', value: '120+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to succeed in the digital world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                    <div className="flex items-center text-primary">
                      Try Now <ChevronRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Experience the difference with Hawaiin Elevation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Images Portfolio */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">3D Image Portfolio</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Explore our stunning 3D renderings and visualizations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {portfolio3DImages.map((image, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5">
                  <img 
                    src={image} 
                    alt={`3D Render ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/3d-images">
              <Button size="lg">
                View All 3D Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Videos Portfolio */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">3D Video Portfolio</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Watch our 3D animations and video productions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {portfolio3DVideos.map((video, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <video 
                    src={video.src} 
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {video.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/3d-videos">
              <Button size="lg" variant="outline">
                Explore 3D Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Logo Portfolio */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Logo Portfolio</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Creative logo designs for brands worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {logos.map((logo, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square bg-white dark:bg-gray-700 flex items-center justify-center p-4">
                  <img 
                    src={logo} 
                    alt={`Logo ${index + 1}`} 
                    className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/logo-portfolio">
              <Button size="lg" variant="outline">
                View Design Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Web Apps */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Web Applications</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Explore our portfolio of innovative digital solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredApps.map((app, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-6">
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {app.description}
                  </p>
                  <a 
                    href={app.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    View Application
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/webapps">
              <Button size="lg" variant="outline">
                View All Applications
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Choose the plan that works for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={plan.popular ? 'ring-2 ring-primary' : ''}>
                {plan.popular && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-4">{plan.price}<span className="text-lg text-gray-500">/month</span></div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                    {plan.popular ? 'Get Started' : 'Try Free'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Got questions? We've got answers</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of professionals who trust Hawaiin Elevation</p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Get in touch with our team for any questions or support</p>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Email:</span>
              <a href="mailto:info@hawaiinelevation.com" className="text-primary hover:underline">info@hawaiinelevation.com</a>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Support:</span>
              <a href="mailto:support@hawaiinelevation.com" className="text-primary hover:underline">support@hawaiinelevation.com</a>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Location:</span>
              <span>123 Business Avenue, Honolulu, HI 96801</span>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/contact-page">
              <Button size="lg">Visit Contact Page</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
