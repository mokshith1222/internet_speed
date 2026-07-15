import type { Metadata } from 'next'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - SpeedTest Support | Get Help with Internet Speed Testing',
  description: 'Need help with SpeedTest? Contact our support team via email for questions, technical support, feedback, or partnership inquiries about our internet speed test tool.',
  keywords: 'speedtest support, contact speedtest, internet speed test help, technical support, speed test feedback',
  openGraph: {
    title: 'Contact Us - SpeedTest Support',
    description: 'Get in touch with SpeedTest support for help with your internet speed testing.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Get in Touch</h1>
        <p className="text-center text-muted-foreground text-xl mb-12">
          Have questions about our speed test tool or need further assistance? We are here to help.
        </p>

        {/* Main Contact Section */}
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
          
          <h2 className="text-3xl font-bold text-foreground mb-4">Email Us for Support</h2>
          
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Whether you have questions about using our speed test tool, need technical support, have feedback to share, or want to partner with us, please reach out via email. We typically respond within 24-48 hours during business days.
          </p>

          <div className="bg-background p-8 rounded-xl mb-8 border border-border">
            <p className="text-sm text-muted-foreground mb-3">Contact Email Address:</p>
            <a
              href="mailto:mokshithnaik67@gmail.com"
              className="text-3xl font-bold text-primary hover:underline break-all"
            >
              mokshithnaik67@gmail.com
            </a>
          </div>

          <p className="text-muted-foreground mb-4">
            In your email, please include:
          </p>

          <ul className="text-left space-y-2 text-muted-foreground mb-8 max-w-md mx-auto">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Your name and email address</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Subject or nature of your inquiry</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Detailed description of your question or issue</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Your test results if reporting an issue</span>
            </li>
          </ul>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-primary font-semibold">
              We appreciate your feedback and will respond promptly to all inquiries.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Common Questions & Support Topics
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Speed Test Not Working?</h3>
              <p className="text-muted-foreground text-sm">
                Try refreshing your browser, clearing cache, disabling browser extensions, or using a different browser. Ensure you have a stable internet connection and adequate bandwidth available for testing.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Unusual Test Results?</h3>
              <p className="text-muted-foreground text-sm">
                Test via ethernet for most accurate results. Close other applications consuming bandwidth. Test at different times to see variations. Results vary based on server location and network congestion.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Mobile Device Issues?</h3>
              <p className="text-muted-foreground text-sm">
                Our speed test works on all mobile devices. Ensure you have strong WiFi signal or cellular connection. Test in different locations to compare results. Mobile speeds may be lower than desktop speeds due to hardware limitations.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Data Privacy</h3>
              <p className="text-muted-foreground text-sm">
                We do not store or share your test results with third parties. Your internet speed test data is not saved on our servers and is only used for real-time measurement purposes during your test session.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Slow Internet?</h3>
              <p className="text-muted-foreground text-sm">
                Move closer to router, reduce interference, close bandwidth-heavy apps, or use ethernet. Restart your modem and router. Check if other devices are consuming bandwidth. Contact your ISP if speeds remain consistently low.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-3">Feature Requests?</h3>
              <p className="text-muted-foreground text-sm">
                We welcome suggestions to improve our speed test tool. Email us with your feature ideas, improvement suggestions, or feedback about your experience using our service.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-8 bg-card border border-border rounded-xl text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Response Time:</span> We aim to respond to all inquiries within 24-48 business hours. For urgent issues, please clearly mark your email as URGENT in the subject line.
          </p>
        </div>
      </div>
    </div>
  )
}
