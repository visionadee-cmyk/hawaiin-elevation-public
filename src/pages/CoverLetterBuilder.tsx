import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { 
  Download, 
  Printer, 
  Save, 
  Eye, 
  Sparkles,
  FileText,
  User,
  Building2,
  Upload,
  X
} from 'lucide-react'
import jsPDF from 'jspdf'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Configure PDF.js worker using jsdelivr CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface CoverLetterData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
  }
  recipientInfo: {
    name: string
    title: string
    company: string
    address: string
  }
  letterDetails: {
    position: string
    jobReference: string
  }
  content: {
    greeting: string
    introduction: string
    body: string
    conclusion: string
    signoff: string
  }
}

const templates = [
  { id: 'professional', name: 'Professional', description: 'Formal business style' },
  { id: 'creative', name: 'Creative', description: 'Modern and unique' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
  { id: 'executive', name: 'Executive', description: 'Senior leadership focused' },
]

export function CoverLetterBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('professional')
  const [autoSave, setAutoSave] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedCV, setUploadedCV] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [isProcessingCV, setIsProcessingCV] = useState(false)

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: ''
    },
    recipientInfo: {
      name: '',
      title: '',
      company: '',
      address: ''
    },
    letterDetails: {
      position: '',
      jobReference: ''
    },
    content: {
      greeting: 'Dear Hiring Manager,',
      introduction: '',
      body: '',
      conclusion: '',
      signoff: 'Sincerely,'
    }
  })

  useEffect(() => {
    if (autoSave && !isGenerating) {
      try {
        localStorage.setItem('coverLetterData', JSON.stringify(coverLetterData))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }, [coverLetterData, autoSave, isGenerating])

  const handleInputChange = (section: keyof CoverLetterData, field: string, value: string) => {
    setCoverLetterData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedCV(file)
    setIsProcessingCV(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let extractedText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        extractedText += pageText + '\n'
      }

      setCvText(extractedText)
      
      // Try to extract personal info from CV
      const lines = extractedText.split('\n').filter(line => line.trim())
      const emailMatch = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/)
      const phoneMatch = extractedText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)
      
      if (emailMatch) {
        handleInputChange('personalInfo', 'email', emailMatch[0])
      }
      if (phoneMatch) {
        handleInputChange('personalInfo', 'phone', phoneMatch[0])
      }
      
      // Try to extract name (first non-empty line)
      if (lines.length > 0) {
        const potentialName = lines[0].trim()
        if (potentialName.length < 50 && !potentialName.includes('@')) {
          handleInputChange('personalInfo', 'fullName', potentialName)
        }
      }

    } catch (error) {
      console.error('Error processing CV:', error)
      alert('Error processing CV. Please try again.')
    } finally {
      setIsProcessingCV(false)
    }
  }

  const removeCV = () => {
    setUploadedCV(null)
    setCvText('')
  }

  const testAPIConnection = async () => {
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || ''
    console.log('Testing API connection...')
    console.log('API Key present:', !!apiKey)
    
    // Try multiple endpoints
    const endpoints = [
      'https://api.groq.com/openai/v1/chat/completions',
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      'https://api.openai.com/v1/chat/completions',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      'https://api.cohere.ai/v1/generate'
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log('Testing endpoint:', endpoint)
        
        let response
        if (endpoint.includes('groq.com')) {
          const groqKey = import.meta.env.VITE_GROQ_API_KEY || ''
          if (!groqKey) {
            console.log('No Groq key, skipping')
            continue
          }
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: 'Hello' }],
              max_tokens: 5,
            }),
          })
        } else if (endpoint.includes('googleapis')) {
          const googleKey = import.meta.env.VITE_GOOGLE_API_KEY || ''
          if (!googleKey) {
            console.log('No Google key, skipping')
            continue
          }
          response = await fetch(`${endpoint}?key=${googleKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Hello, this is a test.' }] }],
            }),
          })
        } else if (endpoint.includes('cohere')) {
          const cohereKey = import.meta.env.VITE_COHERE_API_KEY || ''
          if (!cohereKey) {
            console.log('No Cohere key, skipping')
            continue
          }
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cohereKey}`,
              'Content-Type': 'application/json',
              'X-Client-Name': 'hawain-elevation-plc-site',
            },
            body: JSON.stringify({
              model: 'command',
              prompt: 'Hello, this is a test.',
              max_tokens: 10,
            }),
          })
        } else if (endpoint.includes('api.openai.com')) {
          const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
          if (!openaiKey) {
            console.log('No OpenAI key, skipping')
            continue
          }
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: 'Hello, this is a test.' }],
              max_tokens: 10,
            }),
          })
        } else if (endpoint.includes('googleapis')) {
          const googleKey = import.meta.env.VITE_GOOGLE_API_KEY || ''
          if (!googleKey) {
            console.log('No Google key, skipping')
            continue
          }
          response = await fetch(`${endpoint}?key=${googleKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Hello, this is a test.' }] }],
            }),
          })
        } else if (endpoint.includes('cohere')) {
          const cohereKey = import.meta.env.VITE_COHERE_API_KEY || ''
          if (!cohereKey) {
            console.log('No Cohere key, skipping')
            continue
          }
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cohereKey}`,
              'Content-Type': 'application/json',
              'X-Client-Name': 'hawain-elevation-plc-site',
            },
            body: JSON.stringify({
              model: 'command',
              prompt: 'Hello, this is a test.',
              max_tokens: 10,
            }),
          })
        } else if (endpoint.includes('groq')) {
          const groqKey = import.meta.env.VITE_GROQ_API_KEY || ''
          if (!groqKey) {
            console.log('No Groq key, skipping')
            continue
          }
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama3-8b-8192',
              messages: [{ role: 'user', content: 'Hello, this is a test.' }],
              max_tokens: 10,
            }),
          })
        } else {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: 'Hello, this is a test.',
              parameters: {
                max_new_tokens: 10,
              }
            }),
          })
        }
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        if (response.ok) {
          const result = await response.json()
          console.log('API Response:', result)
          alert(`API Test SUCCESS with ${endpoint}`)
          return
        }
      } catch (error) {
        console.error(`Error with ${endpoint}:`, error)
      }
    }
    
    alert('All API endpoints failed. Check your network configuration.')
  }

  const generateWithAI = async () => {
    if (isGenerating) {
      console.log('Already generating, skipping')
      return
    }
    
    setIsGenerating(true)
    
    try {
      // Try multiple AI providers
      const providers = [
        {
          name: 'Hugging Face',
          key: import.meta.env.VITE_HUGGINGFACE_API_KEY,
          url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
          format: (prompt: string) => ({ inputs: `[INST] ${prompt} [/INST]`, parameters: { max_new_tokens: 500, temperature: 0.7, top_p: 0.95, do_sample: true } }),
          parse: (result: any) => result.generated_text || result[0]?.generated_text || result?.data?.[0]?.generated_text || ''
        },
        {
          name: 'OpenAI',
          key: import.meta.env.VITE_OPENAI_API_KEY,
          url: 'https://api.openai.com/v1/chat/completions',
          format: (prompt: string) => ({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
          parse: (result: any) => result.choices?.[0]?.message?.content || ''
        },
        {
          name: 'Google Gemini',
          key: import.meta.env.VITE_GOOGLE_API_KEY,
          url: (key: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
          format: (prompt: string) => ({ contents: [{ parts: [{ text: prompt }] }] }),
          parse: (result: any) => result.candidates?.[0]?.content?.parts?.[0]?.text || ''
        },
        {
          name: 'Cohere',
          key: import.meta.env.VITE_COHERE_API_KEY,
          url: 'https://api.cohere.ai/v1/chat/completions',
          format: (prompt: string) => ({
            model: 'command',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.7,
          }),
          parse: (result: any) => result.choices?.[0]?.message?.content || result.choices?.[0]?.text || result.generations?.[0]?.text || ''
        },
        {
          name: 'Groq',
          key: import.meta.env.VITE_GROQ_API_KEY,
          url: 'https://api.groq.com/openai/v1/chat/completions',
          format: (prompt: string) => ({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 1000 }),
          parse: (result: any) => result.choices?.[0]?.message?.content || result.choices?.[0]?.text || result.choices?.[0]?.delta?.content || result.generated_text || ''
        }
      ]
      
      const prompt = `You are a professional cover letter writer. Write a compelling, personalized cover letter.

CRITICAL - Use these EXACT values from the form:
- Applicant Name: "${coverLetterData.personalInfo.fullName}"
- Applicant Email: "${coverLetterData.personalInfo.email}"
- Applicant Phone: "${coverLetterData.personalInfo.phone}"
- Company Name: "${coverLetterData.recipientInfo.company}"
- Position: "${coverLetterData.letterDetails.position}"
- Recipient Name: "${coverLetterData.recipientInfo.name || 'Hiring Manager'}"
- Recipient Title: "${coverLetterData.recipientInfo.title || ''}"
- Date: "${new Date().toLocaleDateString()}"

${cvText ? `APPLICANT'S FULL CV CONTENT:\n${cvText}\n\nIMPORTANT: If the form fields above are empty, extract the applicant's name, email, phone, and other details from this CV and use them in the cover letter.` : 'No CV provided'}

STRICT RULES:
1. If "${coverLetterData.personalInfo.fullName}" is empty, extract the name from the CV and use it
2. MUST use the applicant's actual name (from form or CV) as the signature - NEVER use "Your Name"
3. MUST use "${coverLetterData.recipientInfo.company}" throughout - if empty, use a generic placeholder
4. NEVER use brackets like [Company], [Name], [Date] - use actual values
5. Write 3-4 professional paragraphs
6. Include specific details from the CV (experience, skills, achievements)
7. End with the applicant's actual name signature

Write the cover letter now:`
      
      const normalizeAIOutput = (output: any): string => {
        if (output == null) return ''
        if (typeof output === 'string') return output
        if (Array.isArray(output)) return output.map(normalizeAIOutput).join(' ')
        if (typeof output === 'object') {
          if ('parts' in output) return normalizeAIOutput(output.parts)
          if ('text' in output) return normalizeAIOutput(output.text)
          if ('content' in output) return normalizeAIOutput(output.content)
          if ('generated_text' in output) return normalizeAIOutput(output.generated_text)
          return Object.values(output).map(normalizeAIOutput).join(' ')
        }
        return String(output)
      }

      let lastError = null
      let generatedText = ''
      
      for (const provider of providers) {
        if (!provider.key) {
          console.log(`No ${provider.name} key, skipping`)
          continue
        }
        
        try {
          console.log(`Trying ${provider.name}...`)
          
          const url = typeof provider.url === 'function' ? provider.url(provider.key) : provider.url
          const body = provider.format(prompt)
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30000)
          })
          
          if (!response.ok) {
            const text = await response.text()
            console.error(`${provider.name} returned non-OK status`, response.status, response.statusText, text)
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const result = await response.json()
          console.log(`Raw ${provider.name} response:`, result)
          generatedText = normalizeAIOutput(provider.parse(result))
          console.log(`${provider.name} parsed generated text length:`, generatedText.length)
          console.log(`${provider.name} parsed generated text preview:`, generatedText.slice(0, 300))
          
          if (generatedText.trim()) {
            console.log(`Successfully generated with ${provider.name}`)
            break
          }
        } catch (error) {
          console.error(`Error with ${provider.name}:`, error)
          lastError = error
          continue
        }
      }
      
      if (!generatedText) {
        throw new Error(typeof lastError === 'string' ? lastError : 'All AI providers failed to generate content')
      }
      
      // Post-process: Replace any remaining placeholders with actual values
      generatedText = generatedText
        .replace(/Your Name/gi, coverLetterData.personalInfo.fullName)
        .replace(/\[Name\]/gi, coverLetterData.personalInfo.fullName)
        .replace(/\[Company\]/gi, coverLetterData.recipientInfo.company)
        .replace(/\[Position\]/gi, coverLetterData.letterDetails.position)
        .replace(/\[Recipient\]/gi, coverLetterData.recipientInfo.name || 'Hiring Manager')
        .replace(/\[Title\]/gi, coverLetterData.recipientInfo.title || '')
        .replace(/\[Date\]/gi, new Date().toLocaleDateString())
        .replace(/\[Email\]/gi, coverLetterData.personalInfo.email)
        .replace(/\[Phone\]/gi, coverLetterData.personalInfo.phone)
      
      // If form name is empty but CV was provided, try to extract name from generated text
      let extractedName = null
      if (!coverLetterData.personalInfo.fullName && cvText) {
        // Look for signature patterns - more flexible matching
        // Pattern 1: Name before "Sincerely" - extract 2+ capitalized words, ignore contact info
        const beforeSignatureMatch = generatedText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s+(?:[a-zA-Z0-9@.+\-]+\s*)+)?\s*\n\s*(?:Sincerely|Regards|Best regards)/m)
        // Pattern 2: Name after "Sincerely"
        const afterSignatureMatch = generatedText.match(/(?:Sincerely|Regards|Best regards)[\s\n]+([A-Z][a-zA-Z\s]+)$/m)
        // Pattern 3: Look for 2+ capitalized words at the end of text
        const endMatch = generatedText.match(/([A-Z][a-z]+\s+[A-Z][a-zA-Z\s]+)(?:\s+[a-zA-Z0-9@.+\-]+)*\s*$/m)
        
        if (beforeSignatureMatch && beforeSignatureMatch[1]) {
          extractedName = beforeSignatureMatch[1].trim()
        } else if (afterSignatureMatch && afterSignatureMatch[1]) {
          extractedName = afterSignatureMatch[1].trim()
        } else if (endMatch && endMatch[1]) {
          extractedName = endMatch[1].trim()
        }
        
        if (extractedName && extractedName.length > 2 && extractedName.split(' ').length >= 2) {
          generatedText = generatedText.replace(/Your Name/gi, extractedName)
          console.log('Extracted name from generated text:', extractedName)
        }
      }
      
      // Final replacement: ensure "Your Name" is replaced with actual name or extracted name
      const finalName = coverLetterData.personalInfo.fullName || extractedName
      if (finalName) {
        generatedText = generatedText.replace(/Your Name/gi, finalName)
      }
      
      console.log('Applicant full name:', coverLetterData.personalInfo.fullName)
      console.log('Generated text after post-processing:', generatedText.substring(0, 500))
      
      // Parse the generated text into cover letter sections
      const lines = generatedText.split('\n').filter(line => line.trim())
      
      let introduction = ''
      let body = ''
      let conclusion = ''
      
      let currentSection = 'introduction'
      for (const line of lines) {
        if (line.toLowerCase().includes('dear') || line.toLowerCase().includes('hiring')) {
          continue
        }
        if (line.toLowerCase().includes('sincerely') || line.toLowerCase().includes('regards') || line.toLowerCase().includes('thank you')) {
          currentSection = 'conclusion'
        }
        
        if (currentSection === 'introduction' && (line.length > 50 || body)) {
          currentSection = 'body'
        }
        
        if (currentSection === 'introduction') {
          introduction += line + ' '
        } else if (currentSection === 'body') {
          body += line + ' '
        } else {
          conclusion += line + ' '
        }
      }

      // Update state with generated content
      try {
        setCoverLetterData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            introduction: introduction.trim() || `I am writing to express my strong interest in the ${coverLetterData.letterDetails.position} position at ${coverLetterData.recipientInfo.company}. Based on my background and experience, I believe I would be a valuable addition to your team.`,
            body: body.trim() || `My experience and qualifications align well with the requirements of this position. I have developed strong skills throughout my career and am particularly drawn to ${coverLetterData.recipientInfo.company} because of its reputation for excellence. I am confident that my expertise would be valuable to your team.`,
            conclusion: conclusion.trim() || `I am excited about the opportunity to bring my skills and experience to ${coverLetterData.recipientInfo.company}. I would welcome the chance to discuss how I can contribute to your team's success. Thank you for considering my application.`
          }
        }))
      } catch (error) {
        console.error('Error updating cover letter data:', error)
      }
      
      setIsGenerating(false)
    } catch (error) {
      console.error('Error generating cover letter:', error)
      setIsGenerating(false)
      
      // Fallback to template-based generation
      const hasCV = cvText.length > 0
      const cvContext = hasCV ? ' Based on your CV and experience, ' : ''
      
      setCoverLetterData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          introduction: `I am writing to express my strong interest in the ${coverLetterData.letterDetails.position} position at ${coverLetterData.recipientInfo.company}.${cvContext}I believe my background and skills make me an ideal candidate for this role.`,
          body: hasCV 
            ? `My experience and qualifications align well with the requirements of this position. I have developed strong skills in my field and am particularly drawn to ${coverLetterData.recipientInfo.company} because of its reputation for excellence and innovation. I am confident that my expertise would be valuable to your team and I am eager to contribute to your continued success.`
            : `Throughout my career, I have developed strong skills in leadership, problem-solving, and communication. I am particularly drawn to ${coverLetterData.recipientInfo.company} because of its reputation for innovation and excellence. I believe my experience aligns perfectly with the requirements of this role.`,
          conclusion: `I am excited about the opportunity to bring my skills and experience to ${coverLetterData.recipientInfo.company}. I would welcome the chance to discuss how I can contribute to your team's success. Thank you for considering my application.`
        }
      }))
      
      alert(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Using template-based generation instead. Add API keys to .env for AI features (OPENAI_API_KEY, GOOGLE_API_KEY, or HUGGINGFACE_API_KEY).`)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(20)
    doc.text(coverLetterData.personalInfo.fullName, 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(coverLetterData.personalInfo.email, 20, yPosition)
    yPosition += 7
    doc.text(coverLetterData.personalInfo.phone, 20, yPosition)
    yPosition += 7
    doc.text(coverLetterData.personalInfo.address, 20, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.text(new Date().toLocaleDateString(), 20, yPosition)
    yPosition += 15

    doc.text(coverLetterData.recipientInfo.name, 20, yPosition)
    yPosition += 7
    doc.text(coverLetterData.recipientInfo.title, 20, yPosition)
    yPosition += 7
    doc.text(coverLetterData.recipientInfo.company, 20, yPosition)
    yPosition += 7
    doc.text(coverLetterData.recipientInfo.address, 20, yPosition)
    yPosition += 20

    doc.setFontSize(14)
    doc.text(coverLetterData.content.greeting, 20, yPosition)
    yPosition += 15

    doc.setFontSize(11)
    const introductionLines = doc.splitTextToSize(coverLetterData.content.introduction, 170)
    doc.text(introductionLines, 20, yPosition)
    yPosition += introductionLines.length * 7 + 10

    const bodyLines = doc.splitTextToSize(coverLetterData.content.body, 170)
    doc.text(bodyLines, 20, yPosition)
    yPosition += bodyLines.length * 7 + 10

    const conclusionLines = doc.splitTextToSize(coverLetterData.content.conclusion, 170)
    doc.text(conclusionLines, 20, yPosition)
    yPosition += conclusionLines.length * 7 + 15

    doc.text(coverLetterData.content.signoff, 20, yPosition)
    yPosition += 15
    doc.text(coverLetterData.personalInfo.fullName, 20, yPosition)

    doc.save('cover-letter.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cover Letter Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create professional cover letters with AI assistance
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
            <Button variant="outline" size="sm" onClick={testAPIConnection}>
              Test API
            </Button>
            <Button variant="outline" size="sm" onClick={generateWithAI} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
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
                  <div className="text-2xl mb-2">✉️</div>
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
              {/* CV Upload Section */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CV (Optional)
                </h4>
                {!uploadedCV ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      disabled={isProcessingCV}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isProcessingCV ? 'Processing CV...' : 'Click to upload your CV (PDF)'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        We'll extract your info to auto-fill the form
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-primary mr-2" />
                        <div>
                          <p className="font-medium text-sm">{uploadedCV.name}</p>
                          <p className="text-xs text-gray-500">
                            {cvText.length > 0 ? '✓ CV processed successfully' : 'Processing...'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCV}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={coverLetterData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={coverLetterData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    <Input
                      label="Phone"
                      value={coverLetterData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Input
                    label="Address"
                    value={coverLetterData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>

              {/* Recipient Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Recipient Information
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Recipient Name"
                    value={coverLetterData.recipientInfo.name}
                    onChange={(e) => handleInputChange('recipientInfo', 'name', e.target.value)}
                    placeholder="Jane Smith"
                  />
                  <Input
                    label="Recipient Title"
                    value={coverLetterData.recipientInfo.title}
                    onChange={(e) => handleInputChange('recipientInfo', 'title', e.target.value)}
                    placeholder="Hiring Manager"
                  />
                  <Input
                    label="Company"
                    value={coverLetterData.recipientInfo.company}
                    onChange={(e) => handleInputChange('recipientInfo', 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                  <Input
                    label="Company Address"
                    value={coverLetterData.recipientInfo.address}
                    onChange={(e) => handleInputChange('recipientInfo', 'address', e.target.value)}
                    placeholder="456 Business Ave, City, Country"
                  />
                </div>
              </div>

              {/* Letter Details */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Position Details
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Position Applied For"
                    value={coverLetterData.letterDetails.position}
                    onChange={(e) => handleInputChange('letterDetails', 'position', e.target.value)}
                    placeholder="Software Engineer"
                  />
                  <Input
                    label="Job Reference (Optional)"
                    value={coverLetterData.letterDetails.jobReference}
                    onChange={(e) => handleInputChange('letterDetails', 'jobReference', e.target.value)}
                    placeholder="REF-12345"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Letter Content
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Greeting"
                    value={coverLetterData.content.greeting}
                    onChange={(e) => handleInputChange('content', 'greeting', e.target.value)}
                    placeholder="Dear Hiring Manager,"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Introduction
                    </label>
                    <textarea
                      value={coverLetterData.content.introduction}
                      onChange={(e) => handleInputChange('content', 'introduction', e.target.value)}
                      placeholder="I am writing to express my interest in..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Body Paragraphs
                    </label>
                    <textarea
                      value={coverLetterData.content.body}
                      onChange={(e) => handleInputChange('content', 'body', e.target.value)}
                      placeholder="Describe your qualifications and experience..."
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Conclusion
                    </label>
                    <textarea
                      value={coverLetterData.content.conclusion}
                      onChange={(e) => handleInputChange('content', 'conclusion', e.target.value)}
                      placeholder="Thank you for considering my application..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Input
                    label="Sign-off"
                    value={coverLetterData.content.signoff}
                    onChange={(e) => handleInputChange('content', 'signoff', e.target.value)}
                    placeholder="Sincerely,"
                  />
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
              <div id="cover-letter-preview" className={`bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg min-h-[600px] shadow-inner ${
                selectedTemplate === 'professional' ? 'professional-template' :
                selectedTemplate === 'creative' ? 'creative-template' :
                selectedTemplate === 'minimal' ? 'minimal-template' :
                selectedTemplate === 'executive' ? 'executive-template' : ''
              }`}>
                <div className="text-sm md:text-base">
                  {/* Professional Template - Formal Business Style */}
                  {selectedTemplate === 'professional' && (
                    <>
                      {/* Header */}
                      <div className="mb-6 border-b-2 border-gray-300 dark:border-gray-600 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {coverLetterData.personalInfo.fullName || 'Your Name'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {coverLetterData.personalInfo.email} • {coverLetterData.personalInfo.phone}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.personalInfo.address}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="mb-6 text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString()}
                      </div>

                      {/* Recipient */}
                      <div className="mb-6">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {coverLetterData.recipientInfo.name || 'Recipient Name'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.recipientInfo.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.recipientInfo.company}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.recipientInfo.address}
                        </p>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {coverLetterData.content.greeting}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300">
                          {coverLetterData.content.introduction || 'Your introduction will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {coverLetterData.content.body || 'Your main content will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300">
                          {coverLetterData.content.conclusion || 'Your conclusion will appear here...'}
                        </p>

                        <div className="mt-8">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {coverLetterData.content.signoff}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mt-4">
                            {coverLetterData.personalInfo.fullName || 'Your Name'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Creative Template - Modern and Unique */}
                  {selectedTemplate === 'creative' && (
                    <>
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 -mx-6 -mt-6 mb-6 rounded-t-lg">
                        <h2 className="text-2xl md:text-3xl font-bold">
                          {coverLetterData.personalInfo.fullName || 'Your Name'}
                        </h2>
                        <p className="text-white/80 mt-2">
                          {coverLetterData.personalInfo.email} • {coverLetterData.personalInfo.phone}
                        </p>
                        <p className="text-white/80">
                          {coverLetterData.personalInfo.address}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="mb-6 text-primary font-semibold">
                        {new Date().toLocaleDateString()}
                      </div>

                      {/* Recipient */}
                      <div className="mb-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {coverLetterData.recipientInfo.name || 'Recipient Name'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          {coverLetterData.recipientInfo.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.recipientInfo.company}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {coverLetterData.recipientInfo.address}
                        </p>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-4">
                        <p className="text-xl font-bold text-primary">
                          {coverLetterData.content.greeting}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {coverLetterData.content.introduction || 'Your introduction will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                          {coverLetterData.content.body || 'Your main content will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {coverLetterData.content.conclusion || 'Your conclusion will appear here...'}
                        </p>

                        <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                          <p className="font-bold text-primary text-lg">
                            {coverLetterData.content.signoff}
                          </p>
                          <p className="text-gray-900 dark:text-white font-semibold mt-4 text-lg">
                            {coverLetterData.personalInfo.fullName || 'Your Name'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Minimal Template - Clean and Simple */}
                  {selectedTemplate === 'minimal' && (
                    <>
                      {/* Header */}
                      <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                          {coverLetterData.personalInfo.fullName || 'Your Name'}
                        </h2>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <p>{coverLetterData.personalInfo.email} | {coverLetterData.personalInfo.phone} | {coverLetterData.personalInfo.address}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="mb-6 text-gray-400 text-sm uppercase tracking-wider">
                        {new Date().toLocaleDateString()}
                      </div>

                      {/* Recipient */}
                      <div className="mb-6">
                        <p className="text-gray-900 dark:text-white font-light text-lg">
                          {coverLetterData.recipientInfo.name || 'Recipient Name'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {coverLetterData.recipientInfo.title} | {coverLetterData.recipientInfo.company}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {coverLetterData.recipientInfo.address}
                        </p>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-6">
                        <p className="text-gray-900 dark:text-white font-light">
                          {coverLetterData.content.greeting}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          {coverLetterData.content.introduction || 'Your introduction will appear here...'}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 font-light whitespace-pre-line leading-relaxed">
                          {coverLetterData.content.body || 'Your main content will appear here...'}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          {coverLetterData.content.conclusion || 'Your conclusion will appear here...'}
                        </p>

                        <div className="mt-12">
                          <p className="text-gray-900 dark:text-white font-light">
                            {coverLetterData.content.signoff}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 font-light mt-6">
                            {coverLetterData.personalInfo.fullName || 'Your Name'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Executive Template - Senior Leadership Focused */}
                  {selectedTemplate === 'executive' && (
                    <>
                      {/* Header */}
                      <div className="mb-6 border-b-4 border-gray-900 dark:border-white pb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          {coverLetterData.personalInfo.fullName || 'Your Name'}
                        </h2>
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p className="font-medium">{coverLetterData.personalInfo.email}</p>
                          <p>{coverLetterData.personalInfo.phone}</p>
                          <p>{coverLetterData.personalInfo.address}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="mb-6 text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider">
                        {new Date().toLocaleDateString()}
                      </div>

                      {/* Recipient */}
                      <div className="mb-6">
                        <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">
                          {coverLetterData.recipientInfo.name || 'Recipient Name'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm uppercase">
                          {coverLetterData.recipientInfo.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {coverLetterData.recipientInfo.company}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {coverLetterData.recipientInfo.address}
                        </p>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-4">
                        <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">
                          {coverLetterData.content.greeting}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                          {coverLetterData.content.introduction || 'Your introduction will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-justify">
                          {coverLetterData.content.body || 'Your main content will appear here...'}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                          {coverLetterData.content.conclusion || 'Your conclusion will appear here...'}
                        </p>

                        <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">
                            {coverLetterData.content.signoff}
                          </p>
                          <p className="text-gray-900 dark:text-white font-semibold mt-4 uppercase tracking-wide">
                            {coverLetterData.personalInfo.fullName || 'Your Name'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
