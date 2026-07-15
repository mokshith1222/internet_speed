export function SchemaMarkup() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SpeedTest",
    "description": "Fast and accurate internet speed testing tool. Test your download speed, upload speed, ping, and jitter instantly.",
    "url": "https://veloci-pi.vercel.app",
    "applicationCategory": "UtilitiesApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "author": {
      "@type": "Organization",
      "name": "SpeedTest",
      "url": "https://veloci-pi.vercel.app",
      "logo": "https://veloci-pi.vercel.app/logo.png"
    },
    "creator": {
      "@type": "Organization",
      "name": "SpeedTest Team"
    },
    "datePublished": "2024-01-01",
    "keywords": "internet speed test, speed checker, bandwidth test, connection test, download speed, upload speed, ping, jitter"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SpeedTest",
    "url": "https://veloci-pi.vercel.app",
    "logo": "https://veloci-pi.vercel.app/logo.png",
    "description": "Free internet speed testing and measurement service",
    "sameAs": [
      "https://twitter.com/speedtest",
      "https://facebook.com/speedtest"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-SPEEDTEST",
      "contactType": "Customer Support"
    }
  };

  const faqs = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is SpeedTest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SpeedTest is a free internet speed testing tool that measures your download speed, upload speed, ping latency, and connection jitter instantly."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is SpeedTest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SpeedTest provides highly accurate speed measurements by testing your connection to multiple servers and measuring actual data transfer speeds."
        }
      },
      {
        "@type": "Question",
        "name": "Is SpeedTest free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, SpeedTest is completely free. No registration, no hidden fees, and no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "What is good internet speed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Good internet speed depends on your usage. For general browsing: 5-10 Mbps, streaming HD: 15-25 Mbps, 4K streaming: 50+ Mbps, online gaming: 15-35 Mbps."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
      />
    </>
  );
}
