import { useEffect } from 'react'

interface AnalyticsProps {
  trackingId?: string
}

export function Analytics({ trackingId }: AnalyticsProps) {
  useEffect(() => {
    // Google Analytics
    if (trackingId && typeof window !== 'undefined') {
      // Load Google Analytics script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
      document.head.appendChild(script)

      // Initialize gtag
      const dataLayerScript = document.createElement('script')
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
      `
      document.head.appendChild(dataLayerScript)
    }

    // Page view tracking
    const trackPageView = (url: string) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', trackingId, {
          page_path: url,
        })
      }
    }

    // Track initial page view
    trackPageView(window.location.pathname)

    // Track page changes
    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    // Listen for route changes (you may need to integrate this with your router)
    window.addEventListener('popstate', () => {
      handleRouteChange(window.location.pathname)
    })

    return () => {
      window.removeEventListener('popstate', () => {
        handleRouteChange(window.location.pathname)
      })
    }
  }, [trackingId])

  return null
}

// Custom hook for event tracking
export function useAnalytics() {
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams)
    }
  }

  const trackConversion = (value: number, currency: string = 'USD') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID',
        value: value,
        currency: currency,
      })
    }
  }

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      })
    }
  }

  return {
    trackEvent,
    trackConversion,
    trackPageView,
  }
}
