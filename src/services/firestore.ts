import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  CVS: 'cvs',
  COVER_LETTERS: 'coverLetters',
  JOB_EMAILS: 'jobEmails',
  PORTFOLIOS: 'portfolios',
  WEBSITES: 'websites',
  COMPANY_PROFILES: 'companyProfiles',
  BUSINESS_PROPOSALS: 'businessProposals',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  TRANSACTIONS: 'transactions',
  BLOG_POSTS: 'blogPosts',
  CHAT_MESSAGES: 'chatMessages',
  NOTIFICATIONS: 'notifications',
  DESIGN_PROJECTS: 'designProjects',
  THREE_D_PROJECTS: 'threeDProjects',
} as const

// User document structure
export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  subscription?: 'free' | 'pro' | 'enterprise'
  subscriptionEndsAt?: Timestamp
  settings: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
    emailNotifications: boolean
  }
}

// CV document structure
export interface CVDocument {
  id: string
  userId: string
  title: string
  template: string
  data: any
  createdAt: Timestamp
  updatedAt: Timestamp
  isPublic: boolean
}

// Order document structure
export interface OrderDocument {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  shippingAddress: Address
  paymentMethod: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

// Transaction document structure
export interface TransactionDocument {
  id: string
  userId: string
  orderId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: Timestamp
}

// Blog post document structure
export interface BlogPostDocument {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  authorId: string
  category: string
  tags: string[]
  coverImage?: string
  isPublished: boolean
  publishedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  views: number
}

// Chat message document structure
export interface ChatMessageDocument {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  text: string
  attachment?: string
  read: boolean
  createdAt: Timestamp
}

// Notification document structure
export interface NotificationDocument {
  id: string
  userId: string
  type: 'order' | 'payment' | 'message' | 'system' | 'promotion'
  title: string
  body: string
  data?: any
  read: boolean
  createdAt: Timestamp
}

// Design project document structure
export interface DesignProjectDocument {
  id: string
  userId: string
  type: 'logo' | 'banner' | 'poster' | 'social' | 'business-card' | 'flyer' | 'thumbnail' | 'presentation'
  name: string
  data: any
  thumbnail?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 3D project document structure
export interface ThreeDProjectDocument {
  id: string
  userId: string
  type: 'modeling' | 'animation' | 'rendering' | 'printing' | 'scanning' | 'vr-ar'
  name: string
  description: string
  data: any
  modelFile?: string
  thumbnail?: string
  status: 'draft' | 'in-progress' | 'completed'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Generic CRUD operations
export const FirestoreService = {
  // Get a document by ID
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T
      }
      return null
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  },

  // Get all documents from a collection
  async getCollection<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T)
    } catch (error) {
      console.error('Error getting collection:', error)
      throw error
    }
  },

  // Create a new document
  async createDocument<T>(collectionName: string, data: Partial<T>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  },

  // Update a document
  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  },

  // Delete a document
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  },

  // Query documents with filters
  async queryDocuments<T>(
    collectionName: string,
    constraints: any[]
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T)
    } catch (error) {
      console.error('Error querying documents:', error)
      throw error
    }
  },

  // Set a document (create or replace)
  async setDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Error setting document:', error)
      throw error
    }
  }
}

// User-specific operations
export const UserService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return FirestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, userId)
  },

  async createUserProfile(userId: string, email: string): Promise<void> {
    await FirestoreService.setDocument<UserProfile>(COLLECTIONS.USERS, userId, {
      uid: userId,
      email,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      subscription: 'free',
      settings: {
        theme: 'auto',
        language: 'en',
        notifications: true,
        emailNotifications: true
      }
    })
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    await FirestoreService.updateDocument<UserProfile>(COLLECTIONS.USERS, userId, data)
  }
}

// Order-specific operations
export const OrderService = {
  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return FirestoreService.queryDocuments<OrderDocument>(
      COLLECTIONS.ORDERS,
      [where('userId', '==', userId), orderBy('createdAt', 'desc')]
    )
  },

  async createOrder(order: Omit<OrderDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.createDocument<OrderDocument>(COLLECTIONS.ORDERS, order)
  },

  async updateOrderStatus(orderId: string, status: OrderDocument['status']): Promise<void> {
    await FirestoreService.updateDocument<OrderDocument>(COLLECTIONS.ORDERS, orderId, { status })
  }
}

// Notification-specific operations
export const NotificationService = {
  async getUserNotifications(userId: string): Promise<NotificationDocument[]> {
    return FirestoreService.queryDocuments<NotificationDocument>(
      COLLECTIONS.NOTIFICATIONS,
      [where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50)]
    )
  },

  async createNotification(notification: Omit<NotificationDocument, 'id' | 'createdAt'>): Promise<string> {
    return FirestoreService.createDocument<NotificationDocument>(COLLECTIONS.NOTIFICATIONS, notification)
  },

  async markAsRead(notificationId: string): Promise<void> {
    await FirestoreService.updateDocument<NotificationDocument>(COLLECTIONS.NOTIFICATIONS, notificationId, { read: true })
  },

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId)
    const unreadNotifications = notifications.filter(n => !n.read)
    await Promise.all(
      unreadNotifications.map(n => this.markAsRead(n.id))
    )
  }
}

// Blog-specific operations
export const BlogService = {
  async getPublishedPosts(): Promise<BlogPostDocument[]> {
    return FirestoreService.queryDocuments<BlogPostDocument>(
      COLLECTIONS.BLOG_POSTS,
      [where('isPublished', '==', true), orderBy('publishedAt', 'desc')]
    )
  },

  async getPostBySlug(slug: string): Promise<BlogPostDocument | null> {
    const posts = await FirestoreService.queryDocuments<BlogPostDocument>(
      COLLECTIONS.BLOG_POSTS,
      [where('slug', '==', slug), where('isPublished', '==', true)]
    )
    return posts[0] || null
  },

  async createPost(post: Omit<BlogPostDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.createDocument<BlogPostDocument>(COLLECTIONS.BLOG_POSTS, post)
  },

  async updatePost(postId: string, data: Partial<BlogPostDocument>): Promise<void> {
    await FirestoreService.updateDocument<BlogPostDocument>(COLLECTIONS.BLOG_POSTS, postId, data)
  },

  async incrementPostViews(postId: string): Promise<void> {
    const post = await FirestoreService.getDocument<BlogPostDocument>(COLLECTIONS.BLOG_POSTS, postId)
    if (post) {
      await FirestoreService.updateDocument<BlogPostDocument>(COLLECTIONS.BLOG_POSTS, postId, {
        views: (post.views || 0) + 1
      })
    }
  }
}

// Chat-specific operations
export const ChatService = {
  async getConversationMessages(userId1: string, userId2: string): Promise<ChatMessageDocument[]> {
    const conversationId = [userId1, userId2].sort().join('_')
    return FirestoreService.queryDocuments<ChatMessageDocument>(
      COLLECTIONS.CHAT_MESSAGES,
      [where('conversationId', '==', conversationId), orderBy('createdAt', 'asc')]
    )
  },

  async sendMessage(message: Omit<ChatMessageDocument, 'id' | 'createdAt'>): Promise<string> {
    return FirestoreService.createDocument<ChatMessageDocument>(COLLECTIONS.CHAT_MESSAGES, message)
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messages = await FirestoreService.queryDocuments<ChatMessageDocument>(
      COLLECTIONS.CHAT_MESSAGES,
      [where('conversationId', '==', conversationId), where('receiverId', '==', userId)]
    )
    await Promise.all(
      messages.filter(m => !m.read).map(m => 
        FirestoreService.updateDocument<ChatMessageDocument>(COLLECTIONS.CHAT_MESSAGES, m.id, { read: true })
      )
    )
  }
}
