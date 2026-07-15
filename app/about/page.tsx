import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Veloci-Pi - Uncapped Internet Diagnostics',
  description: 'Learn how Veloci-Pi engineered an uncapped, precision-driven internet speed tester designed to bypass CPU bottlenecks and reveal your true network capabilities.',
  keywords: 'about veloci-pi, true internet speed, uncapped speed test, bandwidth diagnostic, network performance, latency analysis',
  openGraph: {
    title: 'About Veloci-Pi - Uncapped Internet Diagnostics',
    description: 'Learn how Veloci-Pi engineered an uncapped, precision-driven internet speed tester designed to bypass CPU bottlenecks and reveal your true network capabilities.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 md:py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 tracking-tight">
          About Veloci-Pi
        </h1>

        <div className="prose prose-lg prose-invert max-w-none text-muted-foreground">
          <p className="text-xl leading-relaxed font-medium text-foreground mb-12">
            Veloci-Pi was forged out of frustration with legacy speed testing utilities. In an era of gigabit fiber and 5G networks, testing tools were failing to accurately report true bandwidth capacities because they were bottlenecked by their own inefficient code. We decided to fix that.
          </p>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">The Fake Results Epidemic</h2>
            <p className="leading-relaxed mb-4">
              Have you ever paid for a 1000 Mbps internet plan, only to run a speed test and see it cap out at 300 Mbps or 400 Mbps? Often, the culprit isn&apos;t your Internet Service Provider (ISP)—it&apos;s the testing tool itself. 
            </p>
            <p className="leading-relaxed">
              Many popular speed tests rely on outdated JavaScript loops to generate test data on the fly. When attempting to measure high-speed connections, the server&apos;s CPU cannot generate data fast enough, resulting in an artificial ceiling. They are measuring their own CPU limitation, not your network bandwidth. 
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">The Veloci-Pi Engineering Difference</h2>
            <p className="leading-relaxed mb-6">
              To solve the artificial capping problem, the Veloci-Pi engineering team rebuilt the testing protocol from the ground up:
            </p>
            <ul className="space-y-6">
              <li className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-primary mb-2">Native C++ Cryptography Buffers</h3>
                <p>Instead of slow loops, our edge servers utilize native C++ cryptographic functions to instantly provision millions of bytes of test data. This ensures the server can saturate any gigabit pipe instantly without CPU strain.</p>
              </li>
              <li className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-secondary mb-2">TTFB Subtraction</h3>
                <p>Traditional tests start the clock the moment you click "Go," which includes DNS lookup and SSL handshake times. Veloci-Pi calculates the Time To First Byte (TTFB) and subtracts it from the equation, ensuring we only measure the actual payload transfer speed.</p>
              </li>
              <li className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-accent mb-2">Uncapped Algorithmic Calculations</h3>
                <p>We removed arbitrary mathematical limits that other scripts use to smooth out their UI animations. What you see on Veloci-Pi is the raw, unadulterated mathematical average of your network&apos;s throughput capacity.</p>
              </li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">No Data Harvesting. Period.</h2>
            <p className="leading-relaxed">
              In a digital landscape dominated by surveillance capitalism, your network diagnostics shouldn&apos;t be a vector for targeted advertising. Veloci-Pi operates on a strict zero-retention policy. We do not store your IP address, we do not log your geographic coordinates, and we do not sell your speed metrics to third-party data brokers. The test happens in your browser, and once you close the tab, the data vanishes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Contact the Engineering Team</h2>
            <p className="leading-relaxed">
              Veloci-Pi is maintained by network enthusiasts who believe in transparency and raw performance. If you&apos;ve discovered a bug, have a feature request, or just want to discuss network infrastructure, reach out to us directly.
            </p>
            <div className="mt-6 p-6 bg-card border border-border rounded-2xl inline-block">
              <span className="font-semibold text-foreground mr-2">Email:</span> 
              <a href="mailto:mokshithnaik67@gmail.com" className="text-blue-500 hover:text-blue-400 transition-colors">mokshithnaik67@gmail.com</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
