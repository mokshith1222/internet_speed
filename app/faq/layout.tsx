import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - SpeedTest | Questions About Internet Speed Testing',
  description: 'Frequently asked questions about internet speed, SpeedTest tool, download speed, upload speed, ping, jitter, and how to improve your connection.',
  keywords: 'speed test FAQ, internet speed questions, download speed, upload speed, ping, jitter, bandwidth, mbps, speed test help',
  openGraph: {
    title: 'FAQ - SpeedTest Internet Speed Test Questions',
    description: 'Get answers to common questions about testing internet speed and SpeedTest.',
    type: 'website',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
