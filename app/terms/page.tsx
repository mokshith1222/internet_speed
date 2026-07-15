import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SpeedTest',
  description: 'Read our terms of service to understand the rules and conditions for using SpeedTest.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using the SpeedTest website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on SpeedTest for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              <li>Engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of SpeedTest</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
            <p>
              The materials on SpeedTest are provided on an &apos;as is&apos; basis. SpeedTest makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
            <p>
              In no event shall SpeedTest or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SpeedTest, even if SpeedTest or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on SpeedTest could include technical, typographical, or photographic errors. SpeedTest does not warrant that any of the materials on our website are accurate, complete, or current. SpeedTest may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Materials and Service</h2>
            <p>
              The materials on SpeedTest and the services provided are distributed on an &apos;as is&apos; basis. SpeedTest and its suppliers disclaim all warranties and conditions with regard to these materials and services, including all implied warranties or conditions of merchantability, fitness for a particular purpose, title, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitations of Liability</h2>
            <p>
              In no case shall SpeedTest, its suppliers, or other related parties be liable for any damages (including, without limitation, incidental and consequential damages, personal injury/wrongful death, lost profits, or damages resulting from lost data or business interruption) resulting from the use of or inability to use SpeedTest or the materials on SpeedTest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Accuracy of Test Results</h2>
            <p>
              SpeedTest provides speed test results based on current network conditions. Results may vary depending on various factors including network congestion, server location, your device capabilities, and other environmental factors. SpeedTest does not guarantee specific speed results and makes no warranty regarding the accuracy or reliability of test results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. User Conduct</h2>
            <p className="mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Perform automated or bulk testing that could negatively impact our service</li>
              <li>Attempt to hack, crack, or compromise our systems</li>
              <li>Use SpeedTest for any illegal or unethical purposes</li>
              <li>Engage in any conduct that could damage our reputation or service</li>
              <li>Share, distribute, or make available our content or service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Revisions and Errata</h2>
            <p>
              The materials appearing on SpeedTest could include technical, typographical, or photographic errors. SpeedTest does not warrant that any of the materials on our website are accurate, complete, or current. SpeedTest may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Links</h2>
            <p>
              SpeedTest has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SpeedTest of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Modifications</h2>
            <p>
              SpeedTest may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where SpeedTest operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in that area.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">14. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
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
