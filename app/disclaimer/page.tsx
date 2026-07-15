import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer - SpeedTest',
  description: 'Read our disclaimer regarding use of SpeedTest and limitations of the service.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Disclaimer</h1>
        <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. General Disclaimer</h2>
            <p className="mb-4">
              The information provided on SpeedTest is for informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the website or its contents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Test Results</h2>
            <p className="mb-4">
              Speed test results depend on numerous factors including your internet service provider, network configuration, device capabilities, and server location. Results may vary from test to test. We do not guarantee the accuracy of any individual test result. Network conditions can change constantly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. No Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, SpeedTest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising out of or relating to your use of this website or service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Content</h2>
            <p className="mb-4">
              This website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is at your own risk and subject to their terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Advertisements</h2>
            <p className="mb-4">
              This site contains advertisements served by Google AdSense and other advertising networks. We are not responsible for advertiser claims or the content of advertisements. Inclusion of advertisements does not constitute endorsement of products or services advertised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. ISP Performance</h2>
            <p className="mb-4">
              Speed test results do not indicate ISP liability or violation of service agreements. Contact your ISP directly if you believe you are not receiving promised speeds. We provide testing tools but cannot guarantee results match your service plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Technical Issues</h2>
            <p className="mb-4">
              We make no warranty that the website will be uninterrupted or error-free. Technical issues, maintenance, or server problems may affect test accuracy. We are not liable for any technical failures or test disruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to Disclaimer</h2>
            <p className="mb-4">
              We reserve the right to modify this disclaimer at any time. Changes take effect immediately upon posting. Your continued use of the website constitutes acceptance of the updated disclaimer.
            </p>
          </section>

          <div className="bg-card border border-border rounded-lg p-6 mt-12">
            <p className="text-sm">
              By using SpeedTest, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree with any part of this disclaimer, please do not use this website.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
