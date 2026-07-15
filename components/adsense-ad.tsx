'use client'

import { useEffect } from 'react'

interface AdSenseAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'native'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  className = '',
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && window.adsbygoogle.length > 0) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      // AdSense script not loaded yet, will retry on next render
    }
  }, [])

  return (
    <div
      className={`adsense-ad ${className}`}
      style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-YOUR_ADSENSE_ID'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
