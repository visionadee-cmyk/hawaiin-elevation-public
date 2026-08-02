import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Sparkles, 
  FileText, 
  Mail, 
  Briefcase, 
  Building2, 
  Megaphone, 
  Languages, 
  Lightbulb, 
  Image as ImageIcon,
  FileCheck,
  MessageSquare,
  Copy,
  Download
} from 'lucide-react'

const aiTools = [
  {
    id: 'resume-ai',
    icon: FileText,
    name: 'Resume AI',
    description: 'AI-powered resume improvement and optimization',
    category: 'Career'
  },
  {
    id: 'cover-letter-ai',
    icon: FileText,
    name: 'Cover Letter AI',
    description: 'Generate perfect cover letters for any job',
    category: 'Career'
  },
  {
    id: 'job-email-ai',
    icon: Mail,
    name: 'Job Email AI',
    description: 'Write professional job application emails',
    category: 'Career'
  },
  {
    id: 'linkedin-ai',
    icon: Briefcase,
    name: 'LinkedIn AI',
    description: 'Optimize your LinkedIn profile and posts',
    category: 'Career'
  },
  {
    id: 'business-name-ai',
    icon: Briefcase,
    name: 'Business Name AI',
    description: 'Generate creative business name ideas',
    category: 'Business'
  },
  {
    id: 'company-description-ai',
    icon: Building2,
    name: 'Company Description AI',
    description: 'Write compelling company descriptions',
    category: 'Business'
  },
  {
    id: 'marketing-ai',
    icon: Megaphone,
    name: 'Marketing AI',
    description: 'Generate marketing copy and campaigns',
    category: 'Marketing'
  },
  {
    id: 'grammar-ai',
    icon: FileCheck,
    name: 'Grammar AI',
    description: 'Check and improve grammar and spelling',
    category: 'Writing'
  },
  {
    id: 'translation-ai',
    icon: Languages,
    name: 'Translation AI',
    description: 'Translate text to multiple languages',
    category: 'Writing'
  },
  {
    id: 'prompt-generator',
    icon: Lightbulb,
    name: 'Prompt Generator',
    description: 'Generate AI prompts for various tasks',
    category: 'AI'
  },
  {
    id: 'image-prompt',
    icon: ImageIcon,
    name: 'Image Prompt Generator',
    description: 'Create prompts for AI image generation',
    category: 'AI'
  },
  {
    id: 'business-plan',
    icon: Briefcase,
    name: 'Business Plan Generator',
    description: 'Generate comprehensive business plans',
    category: 'Business'
  },
  {
    id: 'proposal-generator',
    icon: FileText,
    name: 'Proposal Generator',
    description: 'Create professional business proposals',
    category: 'Business'
  },
  {
    id: 'meeting-minutes',
    icon: MessageSquare,
    name: 'Meeting Minutes',
    description: 'Generate meeting minutes from notes',
    category: 'Business'
  },
  {
    id: 'email-reply',
    icon: Mail,
    name: 'Email Reply Generator',
    description: 'Generate professional email responses',
    category: 'Communication'
  },
]

export function AITools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Career', 'Business', 'Marketing', 'Writing', 'AI', 'Communication']

  const filteredTools = category === 'All' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === category)

  const handleGenerate = async () => {
    if (!input.trim()) return
    
    setLoading(true)
    setOutput('')
    
    // Simulate AI generation
    setTimeout(() => {
      const responses = {
        'resume-ai': `Here's an improved version of your resume:\n\n• Enhanced professional summary highlighting key achievements\n• Optimized skills section with industry keywords\n• Improved bullet points with action verbs and quantifiable results\n• Better formatting for ATS compatibility\n\nYour resume score has improved from 65% to 85%!`,
        'cover-letter-ai': `Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role at [Company]. With my experience in [relevant field] and passion for [relevant skill], I am confident in my ability to contribute effectively to your team.\n\nIn my previous role, I successfully [key achievement], resulting in [quantifiable result]. I am excited about the opportunity to bring similar results to [Company].\n\nThank you for considering my application. I look forward to discussing how I can contribute to your team's success.\n\nSincerely,\n[Your Name]`,
        'job-email-ai': `Subject: Application for [Position] - [Your Name]\n\nDear Hiring Manager,\n\nI hope this email finds you well. I am writing to apply for the [Position] role at [Company], as advertised on [where you saw the job].\n\nWith [number] years of experience in [field], I have developed strong skills in [key skills]. I am particularly drawn to this opportunity because [reason].\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my background aligns with your needs.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Your Phone]\n[Your Email]`,
        'linkedin-ai': `Optimized LinkedIn Profile Summary:\n\n🚀 [Your Professional Title] | [Industry Expert]\n\nPassionate [Industry Professional] with [number]+ years of experience driving [key outcomes]. Skilled in [key skills 1], [key skills 2], and [key skills 3].\n\n🎯 Key Achievements:\n• [Achievement 1 with metrics]\n• [Achievement 2 with metrics]\n• [Achievement 3 with metrics]\n\n💡 Let's connect to discuss [industry topic] and explore potential collaborations!\n\n#LinkedIn #Professional #[Industry]`,
        'business-name-ai': `Here are some creative business name ideas:\n\n1. [Industry]Pro Solutions\n2. [Industry]Wise\n3. [Industry]Craft\n4. [Industry]Nest\n5. [Industry]Forge\n6. [Industry]Peak\n7. [Industry]Flow\n8. [Industry]Spark\n9. [Industry]Bridge\n10. [Industry]Vision\n\nEach name includes your industry focus and conveys professionalism and expertise.`,
        'company-description-ai': `[Company Name] is a leading [industry] company dedicated to delivering innovative solutions that empower businesses to achieve their goals. With over [number] years of experience, we have built a reputation for excellence, reliability, and customer-centric service.\n\nOur team of experts combines deep industry knowledge with cutting-edge technology to provide [key services]. We pride ourselves on our commitment to quality, innovation, and sustainable growth.\n\nAt [Company Name], we believe in building lasting partnerships with our clients, understanding their unique challenges, and delivering tailored solutions that drive real results.`,
        'marketing-ai': `Marketing Campaign Copy:\n\n🎯 Headline: Transform Your [Industry] Experience with [Product/Service]\n\n✨ Hook: Tired of [pain point]? Discover how [Product/Service] is revolutionizing the way [target audience] [action].\n\n📝 Body:\n• [Benefit 1]: Our solution delivers [specific result]\n• [Benefit 2]: Join [number]+ satisfied customers\n• [Benefit 3]: Backed by [credibility factor]\n\n🎁 CTA: Get started today with [special offer]! Limited time only.\n\n#Marketing #[Industry] #[Product]`,
        'grammar-ai': `Grammar Check Results:\n\n✓ Corrected: [original text] → [corrected text]\n✓ Improved: [original text] → [improved text]\n✓ Suggestion: Consider using [alternative phrasing] for better clarity\n\nOverall Quality: Good\nReadability Score: 8/10\nSuggestions: 3 improvements made`,
        'translation-ai': `Translation:\n\nOriginal: [Your text]\n\nTranslated: [Translated text in target language]\n\nNote: Translation accuracy may vary. For important documents, consider professional translation services.`,
        'prompt-generator': `AI Prompt:\n\n"Act as an expert [role]. Your task is to [specific task]. Please provide [desired output] that includes [key elements]. Consider [context/audience] and ensure the response is [tone/style].\n\nAdditional requirements:\n• [Requirement 1]\n• [Requirement 2]\n• [Requirement 3]"`,
        'image-prompt': `Image Generation Prompt:\n\n"A [style] image of [subject] in [setting]. Key elements: [element 1], [element 2], [element 3]. Lighting: [lighting description]. Mood: [mood]. Color palette: [colors]. Composition: [composition details]. High quality, detailed, professional."`,
        'business-plan': `Business Plan Outline:\n\n1. Executive Summary\n   • Mission statement\n   • Business overview\n   • Key objectives\n\n2. Company Description\n   • Business structure\n   • Products/services\n   • Target market\n\n3. Market Analysis\n   • Industry overview\n   • Competitor analysis\n   • Market opportunities\n\n4. Organization & Management\n   • Organizational structure\n   • Management team\n   • Personnel plan\n\n5. Products & Services\n   • Product descriptions\n   • Competitive advantages\n   • Development roadmap\n\n6. Marketing & Sales\n   • Marketing strategy\n   • Sales strategy\n   • Pricing strategy\n\n7. Financial Projections\n   • Revenue projections\n   • Cost analysis\n   • Funding requirements\n\n8. Appendix\n   • Supporting documents\n   • Additional data`,
        'proposal-generator': `Business Proposal:\n\n[Date]\n\n[Client Name]\n[Client Company]\n[Client Address]\n\nSubject: Proposal for [Project Name]\n\nDear [Client Name],\n\nThank you for the opportunity to submit this proposal for [project description]. We are excited about the possibility of working with [Client Company] to achieve [project goals].\n\nProject Overview:\n• Objectives: [list objectives]\n• Scope: [project scope]\n• Timeline: [project timeline]\n\nOur Approach:\n• Methodology: [approach description]\n• Team: [team composition]\n• Deliverables: [list deliverables]\n\nInvestment:\n• Total Cost: [amount]\n• Payment Terms: [terms]\n\nWe look forward to discussing this proposal further and answering any questions you may have.\n\nSincerely,\n[Your Name]\n[Your Company]`,
        'meeting-minutes': `Meeting Minutes\n\nDate: [Date]\nTime: [Time]\nLocation: [Location/Platform]\nAttendees: [List attendees]\n\nAgenda Items:\n1. [Agenda item 1]\n   - Discussion: [summary]\n   - Decision: [outcome]\n   - Action Items: [assignments]\n\n2. [Agenda item 2]\n   - Discussion: [summary]\n   - Decision: [outcome]\n   - Action Items: [assignments]\n\nNext Meeting:\nDate: [Date]\nTime: [Time]\nAgenda: [preliminary agenda]`,
        'email-reply': `Professional Email Response:\n\nSubject: Re: [Original Subject]\n\nDear [Sender Name],\n\nThank you for your email regarding [topic]. I appreciate you bringing this to my attention.\n\n[Response to their message - addressing key points]\n\n[Next steps or action items]\n\nPlease let me know if you need any additional information or have further questions.\n\nBest regards,\n[Your Name]`,
      }

      setOutput(responses[selectedTool as keyof typeof responses] || 'AI response generated successfully!')
      setLoading(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-generated-content.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <Sparkles className="w-8 h-8 inline mr-2 text-primary" />
            AI Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Harness the power of AI to accelerate your work
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!selectedTool ? (
          /* Tools Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div 
                  key={tool.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <Badge variant="info" className="text-xs">{tool.category}</Badge>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-2">{tool.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{tool.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          /* Tool Interface */
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setSelectedTool(null)}
              className="mb-6"
            >
              ← Back to Tools
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  {(() => {
                    const Icon = aiTools.find(t => t.id === selectedTool)?.icon || Sparkles
                    return <Icon className="w-6 h-6 text-primary mr-2" />
                  })()}
                  <h2 className="text-xl md:text-2xl font-bold">
                    {aiTools.find(t => t.id === selectedTool)?.name}
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Input
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                    placeholder="Enter your text or description here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !input.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>

                {output && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Output
                      </label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadOutput}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                        {output}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
