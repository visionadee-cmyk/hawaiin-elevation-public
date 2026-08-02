// Search and filtering utilities

export interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  includePartial?: boolean
}

export interface FilterOptions {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between'
  value: any
  value2?: any // For 'between' operator
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * Generic search function that searches through an array of objects
 */
export function search<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
  options: SearchOptions = {}
): T[] {
  const {
    caseSensitive = false,
    exactMatch = false,
    includePartial = true
  } = options

  if (!query.trim()) {
    return items
  }

  const searchQuery = caseSensitive ? query : query.toLowerCase()

  return items.filter(item => {
    return searchFields.some(field => {
      const value = String(item[field] || '')
      const compareValue = caseSensitive ? value : value.toLowerCase()

      if (exactMatch) {
        return compareValue === searchQuery
      }

      if (includePartial) {
        return compareValue.includes(searchQuery)
      }

      return compareValue === searchQuery
    })
  })
}

/**
 * Filter an array of objects based on multiple filter criteria
 */
export function filter<T>(items: T[], filters: FilterOptions[]): T[] {
  return items.filter(item => {
    return filters.every(filter => {
      const itemValue = item[filter.field as keyof T]
      
      switch (filter.operator) {
        case 'equals':
          return itemValue === filter.value
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase())
        case 'startsWith':
          return String(itemValue).toLowerCase().startsWith(String(filter.value).toLowerCase())
        case 'endsWith':
          return String(itemValue).toLowerCase().endsWith(String(filter.value).toLowerCase())
        case 'greaterThan':
          return Number(itemValue) > Number(filter.value)
        case 'lessThan':
          return Number(itemValue) < Number(filter.value)
        case 'between':
          return Number(itemValue) >= Number(filter.value) && Number(itemValue) <= Number(filter.value2!)
        default:
          return true
      }
    })
  })
}

/**
 * Sort an array of objects based on a field and direction
 */
export function sort<T>(items: T[], sortOptions: SortOptions): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortOptions.field as keyof T]
    const bValue = b[sortOptions.field as keyof T]

    let comparison = 0

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime()
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return sortOptions.direction === 'desc' ? -comparison : comparison
  })
}

/**
 * Advanced search with filters and sorting combined
 */
export function advancedSearch<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
  filters: FilterOptions[] = [],
  sortOptions?: SortOptions,
  searchOptions: SearchOptions = {}
): T[] {
  let results = search(items, query, searchFields, searchOptions)
  
  if (filters.length > 0) {
    results = filter(results, filters)
  }
  
  if (sortOptions) {
    results = sort(results, sortOptions)
  }
  
  return results
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  highlightClass: string = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!searchTerm.trim()) {
    return text
  }

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi')
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`)
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Fuzzy search implementation for more lenient matching
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
  threshold: number = 0.6
): T[] {
  if (!query.trim()) {
    return items
  }

  return items
    .map(item => {
      let maxScore = 0
      searchFields.forEach(field => {
        const value = String(item[field] || '')
        const score = calculateFuzzyScore(query, value)
        if (score > maxScore) {
          maxScore = score
        }
      })
      return { item, score: maxScore }
    })
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

/**
 * Calculate fuzzy match score between two strings
 */
function calculateFuzzyScore(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  if (textLower === queryLower) {
    return 1
  }

  if (textLower.includes(queryLower)) {
    return 0.8
  }

  let score = 0
  let queryIndex = 0
  let textIndex = 0

  while (queryIndex < queryLower.length && textIndex < textLower.length) {
    if (queryLower[queryIndex] === textLower[textIndex]) {
      score += 1
      queryIndex++
    }
    textIndex++
  }

  return score / queryLower.length
}

/**
 * Paginate results
 */
export function paginate<T>(items: T[], page: number, itemsPerPage: number): {
  items: T[]
  totalPages: number
  currentPage: number
} {
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    currentPage
  }
}

/**
 * Get unique values from a field in an array
 */
export function getUniqueValues<T>(items: T[], field: keyof T): any[] {
  return Array.from(new Set(items.map(item => item[field])))
}

/**
 * Group items by a field
 */
export function groupBy<T>(items: T[], field: keyof T): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = String(item[field])
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Range filter helper
 */
export function createRangeFilter(
  field: string,
  minValue: number,
  maxValue: number
): FilterOptions {
  return {
    field,
    operator: 'between',
    value: minValue,
    value2: maxValue
  }
}

/**
 * Date range filter helper
 */
export function createDateRangeFilter(
  field: string,
  startDate: Date,
  endDate: Date
): FilterOptions {
  return {
    field,
    operator: 'between',
    value: startDate.getTime(),
    value2: endDate.getTime()
  }
}

/**
 * Multi-select filter helper
 */
export function createMultiSelectFilter(
  field: string,
  values: any[]
): FilterOptions[] {
  return values.map(value => ({
    field,
    operator: 'equals',
    value
  }))
}
