# Hawaiin Elevation

**"LET US FIX"**

A comprehensive digital services platform that combines the best of Canva, Resume.io, Fiverr, LinkedIn, Notion, Wix, Framer, and ChatGPT into one powerful application.

## 🚀 Features

### Core Services
- **CV Builder** - Professional resume builder with ATS scoring, live preview, and multiple templates
- **Cover Letter Builder** - AI-powered cover letter generation
- **Job Application Email** - Professional email templates for job applications
- **Portfolio Website Builder** - Create stunning portfolio websites
- **Personal Website Builder** - Build personal websites with ease
- **Company Website Builder** - Professional company website creation
- **Company Profile Builder** - Comprehensive company profile documents
- **Business Proposal Builder** - Generate professional proposals and agreements

### AI Tools
- Resume AI - CV improvement and optimization
- Cover Letter AI - Smart cover letter generation
- Job Email AI - Professional job application emails
- LinkedIn AI - Profile optimization
- Business Name AI - Creative business name generation
- Company Description AI - Compelling company descriptions
- Marketing AI - Marketing copy and campaigns
- Grammar AI - Grammar and spell checking
- Translation AI - Multi-language translation
- Prompt Generator - AI prompt generation
- Image Prompt Generator - AI image prompts
- Business Plan Generator - Comprehensive business plans
- Proposal Generator - Professional proposals
- Meeting Minutes - Automated meeting notes
- Email Reply Generator - Professional email responses

### Graphic Design Tools
- Business Cards
- Flyers
- Posters
- Brochures
- Certificates
- Invitations
- Menus
- Price Lists
- ID Cards
- Social Media Posts (Instagram, Facebook, LinkedIn, YouTube)

### 3D Services
- Blender
- Laser Cutting
- CNC
- 3D Printing
- AutoCAD
- Furniture Design
- Product Mockup

### Platform Features
- **Authentication** - Firebase Auth with Email & Google login
- **User Dashboards** - Customer and Admin dashboards
- **Online Order System** - Complete order management
- **Live Chat** - Real-time support chat
- **Blog System** - Content management
- **Payment System** - Multiple payment options
- **Dark/Light Mode** - Theme switching
- **PWA Support** - Offline functionality
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **Firebase Authentication** - User auth
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage
- **Cloudinary** - Image management
- **EmailJS** - Email services

### Libraries
- **jsPDF** - PDF generation
- **QRCode** - QR code generation
- **Recharts** - Charts and graphs
- **react-helmet-async** - SEO management
- **Framer Motion** - Smooth animations

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hawain-elevation-plc-site
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_API_KEY`
- `VITE_CLOUDINARY_API_SECRET`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

4. Start the development server
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, Badge, etc.)
│   ├── Navigation.tsx  # Main navigation
│   ├── Footer.tsx      # Footer component
│   ├── SEO.tsx         # SEO optimization component
│   ├── Analytics.tsx   # Google Analytics integration
│   └── NotificationCenter.tsx  # Notification center
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CustomerDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── CVBuilder.tsx
│   ├── CoverLetterBuilder.tsx
│   ├── JobEmailBuilder.tsx
│   ├── PortfolioBuilder.tsx
│   ├── PersonalWebsiteBuilder.tsx
│   ├── CompanyWebsiteBuilder.tsx
│   ├── CompanyProfileBuilder.tsx
│   ├── BusinessProposalBuilder.tsx
│   ├── GraphicDesignTools.tsx
│   ├── Services3D.tsx
│   ├── OrderSystem.tsx
│   ├── LiveChat.tsx
│   ├── Blog.tsx
│   ├── ContactPage.tsx
│   ├── PaymentSystem.tsx
│   └── AITools.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/              # Custom React hooks
├── services/           # API and service functions
│   └── firestore.ts    # Firestore database service layer
├── utils/              # Utility functions
│   └── search.ts       # Search and filtering utilities
├── lib/                # Library configurations
│   ├── firebase.ts
│   ├── cloudinary.ts
│   └── utils.ts
└── assets/             # Static assets
```

## 🎨 Branding

- **Primary Color**: Dark Blue (#1e3a8a)
- **Secondary Color**: Bright Red (#ef4444)
- **Background**: White (#ffffff)
- **Style**: Modern, Professional, Premium
- **Design**: Rounded corners, smooth animations, glassmorphism

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy

### Manual Build
```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Enable Storage
5. Copy credentials to `.env`

### Cloudinary Setup
1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Create an upload preset
3. Copy credentials to `.env`

### EmailJS Setup
1. Create an account at [emailjs.com](https://emailjs.com)
2. Set up email service and template
3. Copy credentials to `.env`

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop
- Laptop
- Tablet
- Mobile
- PWA (Progressive Web App)

## 🔮 Future Roadmap

- [ ] Android App
- [ ] iOS App
- [ ] Advanced AI integrations
- [ ] More template options
- [ ] Collaboration features
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Real-time collaboration on documents
- [ ] Video conferencing integration
- [ ] Mobile app push notifications

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email info@hawaiinelevation.com or visit our contact page.

---

**Built with ❤️ by Hawaiin Elevation Team**
