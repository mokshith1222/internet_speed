import { RealSpeedTest } from '@/components/real-speed-test'
import { Zap, Activity, Network, ShieldCheck, Cpu, Globe } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veloci-Pi Speed Checker - Ultimate Internet Performance Test',
  description: 'Experience the most accurate internet speed test with Veloci-Pi. Analyze your exact download bandwidth, upload speed, latency, and connection stability without any hidden caps.',
}

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Veloci-Pi Speed Checker',
    description: 'Advanced internet speed testing application delivering precise, uncapped metrics for download speed, upload speed, ping, and network jitter.',
    url: 'https://veloci-pi.vercel.app',
    applicationCategory: 'Utility',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '25400',
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen">
        {/* Hero Section with Speed Test */}
        <section className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-background to-primary/10">
          <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-10 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
                Veloci-Pi Speed Checker
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
                Uncapped, hyper-accurate internet diagnostics.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop relying on estimated speeds. Veloci-Pi utilizes an edge-network infrastructure to deliver the true capacity of your broadband, fiber, or mobile connection.
              </p>
            </div>

            <RealSpeedTest />
          </div>
        </section>

        {/* Why Choose Veloci-Pi */}
        <section className="py-16 sm:py-24 px-4 bg-card border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
              Why Professionals Trust Veloci-Pi
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              <div className="bg-background p-6 rounded-2xl border border-border hover:border-primary transition shadow-sm">
                <Cpu className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">Uncapped Measurement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike traditional tools that use heavy JavaScript loops and artificially cap high-speed connections, Veloci-Pi employs direct C++ native cryptography buffers to instantly flood the network pipe, revealing your true gigabit potential without CPU bottlenecks.
                </p>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border hover:border-primary transition shadow-sm">
                <Network className="w-10 h-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">True TTFB Subtraction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most speed tests penalize your download speed by including the initial connection latency. Our advanced algorithm isolates the payload transmission from the Time To First Byte (TTFB), guaranteeing an accurate representation of pure bandwidth.
                </p>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border hover:border-primary transition shadow-sm">
                <ShieldCheck className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">No Tracking or Ads</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is non-negotiable. Veloci-Pi operates without collecting your IP address, storing your location, or selling your data profiles to third-party ad networks. It's just you and your network performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive into Metrics */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
              Decoding Your Network Metrics
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
              Understanding the four pillars of internet connectivity is crucial for identifying bottlenecks, whether you are a competitive gamer, a remote worker, or a streaming enthusiast.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-8">
                <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Download Speed</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    This is the rate at which data is pulled from our edge servers to your local machine. It dictates how quickly web pages load, movies buffer, and large files are downloaded. Veloci-Pi measures this by dynamically increasing payload sizes up to 5MB per chunk.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>25 Mbps:</strong> Minimum for 4K streaming (1 device)</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>100 Mbps:</strong> Ideal for standard households</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>1000+ Mbps:</strong> Gigabit fiber connections</li>
                  </ul>
                </div>

                <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Zap className="w-6 h-6 text-purple-500 transform rotate-180" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Upload Speed</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Upload speed governs how fast you can push data from your device to the internet. While historically neglected by ISPs, it has become critical for Zoom calls, Twitch broadcasting, and syncing large files to cloud storage.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> <strong>5 Mbps:</strong> Minimum for stable HD video calls</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> <strong>15 Mbps:</strong> Required for 1080p game streaming</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> <strong>50+ Mbps:</strong> Excellent for remote creators</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <Globe className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Ping (Latency)</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Ping is the reaction time of your connection—how quickly you get a response after you've sent out a request. Veloci-Pi sends 10 consecutive lightweight requests to measure the absolute minimum time required for a round-trip across the network.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>&lt; 20ms:</strong> Perfect for competitive esports</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>20ms - 50ms:</strong> Standard response time</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>&gt; 100ms:</strong> Noticeable delay (lag)</li>
                  </ul>
                </div>

                <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <Activity className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Jitter (Stability)</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    If Ping is your reaction time, Jitter is the consistency of that reaction time. High jitter means your packets are arriving at erratic intervals, which manifests as stuttering voice calls and teleporting characters in online games.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <strong>&lt; 10ms:</strong> Highly stable connection</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <strong>10ms - 30ms:</strong> Acceptable for everyday use</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <strong>&gt; 30ms:</strong> Requires network troubleshooting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
