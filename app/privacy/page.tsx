import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SpeedTest',
  description: 'Read our privacy policy to understand how we protect your data and respect your privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              SpeedTest (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Company&quot;) operates the SpeedTest website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. We comply with Google AdSense policies and Google Privacy standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Speed Test Results:</strong> When you run a speed test, we collect data about your connection speed, ping, jitter, and upload/download speeds. This data is used to provide your test results.</li>
              <li><strong>Device Information:</strong> We may collect information about your device type, operating system, and browser type to optimize our service.</li>
              <li><strong>Usage Data:</strong> We collect information about how you use our service, including which features you access and how long you stay on our site.</li>
              <li><strong>IP Address:</strong> Your IP address is collected to determine your approximate location and to connect you to the nearest testing server.</li>
              <li><strong>Cookies:</strong> We use cookies to remember your preferences and improve your user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our speed testing service</li>
              <li>To improve and optimize our website and service</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect and prevent fraudulent activity</li>
              <li>To respond to user inquiries and provide customer support</li>
              <li>To send you technical notices and support messages</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Retention</h2>
            <p>
              We do not permanently store your speed test results on our servers. Test results are displayed to you in real-time and are not retained for any extended period. We may retain aggregated, anonymized data for statistical analysis and service improvement purposes. This anonymized data cannot be used to identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Sharing</h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We do not share your speed test results with internet service providers, advertisers, or any other entities without your explicit consent. However, we may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>With service providers who assist us in operating our website and providing our services</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, but we strive to protect your information using industry-standard encryption and security protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="mb-3">
              We use cookies and similar tracking technologies to enhance your user experience. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Children&apos;s Privacy</h2>
            <p>
              SpeedTest does not knowingly collect personal information from children under the age of 13. If we become aware that we have collected information from a child under 13, we will delete such information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. GDPR and Data Rights</h2>
            <p className="mb-3">
              If you are a resident of the European Union or other regions with data protection regulations, you may have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to restrict or object to data processing</li>
              <li>The right to data portability</li>
            </ul>
            <p className="mt-3">To exercise these rights, please contact us at mokshithnaik67@gmail.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website and updating the &quot;Last updated&quot; date. Your continued use of our service constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-4 text-blue-400">
              Email: mokshithnaik67@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
