import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Veloci-Pi Speed Checker',
  description: 'Answers to the most common questions about internet speeds, bandwidth diagnostics, latency, and how Veloci-Pi achieves uncapped measurement accuracy.',
  keywords: 'speed test FAQ, internet speed questions, what is jitter, why is my internet slow, veloci-pi troubleshooting, bandwidth guide',
  openGraph: {
    title: 'FAQ - Veloci-Pi Speed Checker',
    description: 'Answers to the most common questions about internet speeds, bandwidth diagnostics, and how Veloci-Pi achieves uncapped accuracy.',
    type: 'website',
  },
}

export default function FAQPage() {
  const faqs = [
    {
      question: "Why does Veloci-Pi show a different speed than my ISP's official test?",
      answer: "Many Internet Service Providers host their own speed test servers within their own network (often locally in your city). When you use an ISP's test, your data never actually traverses the public internet, resulting in artificially perfect speeds. Veloci-Pi connects to independent edge-network nodes on the public web, giving you the real-world speed you actually experience when browsing sites or downloading files from non-ISP servers."
    },
    {
      question: "Why were my previous speed test results 'fake' or capped?",
      answer: "Older speed testing scripts generate random test data using JavaScript loops directly in the browser or on the server. If you have a Gigabit connection, the server's CPU often cannot generate the random data fast enough to saturate your bandwidth, causing the test to measure the server's CPU limit instead of your internet speed. Veloci-Pi uses native C++ cryptography buffers to eliminate this bottleneck, providing true, uncapped measurements."
    },
    {
      question: "What exactly is 'TTFB' and why does Veloci-Pi subtract it?",
      answer: "TTFB stands for Time To First Byte. It includes DNS resolution, TCP handshakes, and SSL negotiation. Traditional tests start their timer the second you click 'Start', which penalizes your download speed calculation with latency overhead. Veloci-Pi starts measuring throughput only after the payload begins transferring, yielding a mathematically pure bandwidth calculation."
    },
    {
      question: "How much data does running a Veloci-Pi test consume?",
      answer: "Veloci-Pi dynamically scales payload sizes based on how fast your initial chunks download. For average connections, a full test (Ping, Download, Upload) consumes roughly 15MB to 25MB of data. If you are on a metered mobile connection (like a limited 4G/5G data plan), please be aware of this usage."
    },
    {
      question: "Why is my Upload speed significantly lower than my Download speed?",
      answer: "This is completely normal for most residential broadband connections (like Cable or DSL), which are designed to be 'asymmetrical'. ISPs allocate more of the physical cable's frequency spectrum to downloading because the average user consumes much more data (streaming Netflix, downloading games) than they send. If you have a Fiber-to-the-Home (FTTH) connection, you will typically see 'symmetrical' speeds where upload and download are nearly identical."
    },
    {
      question: "What is an acceptable Ping (Latency) for competitive gaming?",
      answer: "For fast-paced competitive shooters or fighting games, a ping under 20ms is ideal, and anything under 50ms is very good. Once your ping exceeds 80-100ms, you will experience noticeable 'peeker's advantage' issues and delayed hit registration. To improve ping, always use a wired Ethernet cable instead of WiFi."
    },
    {
      question: "Can I run Veloci-Pi on my smartphone?",
      answer: "Yes. Veloci-Pi is built with a responsive layout designed to run flawlessly on mobile devices. You can use it to test your home WiFi strength by walking to different rooms, or turn off WiFi to test your cellular provider's 4G/5G network speed."
    }
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <div className="min-h-screen py-16 md:py-24 px-4 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 text-center tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Everything you need to know about network diagnostics, latency, and how to interpret your Veloci-Pi results.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {faq.question}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
