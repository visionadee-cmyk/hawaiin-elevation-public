import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: string
  views: number
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Create a Professional CV in 2024',
    excerpt: 'Learn the latest trends and best practices for creating a standout CV that gets you hired.',
    content: 'Full article content here...',
    author: 'John Smith',
    date: '2024-01-15',
    category: 'Career',
    tags: ['CV', 'Career', 'Tips'],
    image: '📄',
    readTime: '5 min read',
    views: 1234
  },
  {
    id: '2',
    title: '10 Tips for Better Website Design',
    excerpt: 'Discover the essential principles of modern web design that will make your site stand out.',
    content: 'Full article content here...',
    author: 'Sarah Johnson',
    date: '2024-01-14',
    category: 'Design',
    tags: ['Web Design', 'UI/UX', 'Tips'],
    image: '🎨',
    readTime: '8 min read',
    views: 987
  },
  {
    id: '3',
    title: 'The Future of AI in Business',
    excerpt: 'Explore how artificial intelligence is transforming the business landscape and what it means for you.',
    content: 'Full article content here...',
    author: 'Mike Wilson',
    date: '2024-01-13',
    category: 'Technology',
    tags: ['AI', 'Business', 'Future'],
    image: '🤖',
    readTime: '6 min read',
    views: 2345
  },
  {
    id: '4',
    title: 'Building Your Personal Brand',
    excerpt: 'A comprehensive guide to establishing and growing your personal brand in the digital age.',
    content: 'Full article content here...',
    author: 'Emily Davis',
    date: '2024-01-12',
    category: 'Marketing',
    tags: ['Branding', 'Marketing', 'Personal'],
    image: '✨',
    readTime: '7 min read',
    views: 876
  },
]

const categories = ['All', 'Career', 'Design', 'Technology', 'Marketing', 'Business']

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Insights, tips, and updates from our team
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {!selectedPost ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
                      {post.image}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="info">{post.category}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Button variant="outline" size="sm" onClick={() => setSelectedPost(null)} className="mb-6">
              ← Back to Blog
            </Button>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="info">{selectedPost.category}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedPost.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-8xl mb-6 rounded-lg">
                    {selectedPost.image}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{selectedPost.views} views</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {selectedPost.excerpt}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Takeaways</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>First important point from the article</li>
                    <li>Second key insight to remember</li>
                    <li>Third actionable takeaway</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this article</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Twitter</Button>
                    <Button variant="outline" size="sm">LinkedIn</Button>
                    <Button variant="outline" size="sm">Facebook</Button>
                    <Button variant="outline" size="sm">Copy Link</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
