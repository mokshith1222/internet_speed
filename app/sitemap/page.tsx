import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitemap - SpeedTest',
  description: 'Browse the complete sitemap of SpeedTest with links to all pages and sections.',
}

export default function SitemapPage() {
  const siteStructure = [
    {
      category: 'Main Pages',
      links: [
        { href: '/', label: 'Speed Test Tool', description: 'Test your internet speed' },
        { href: '/about', label: 'About Us', description: 'Learn about SpeedTest' },
      ],
    },
    {
      category: 'Information',
      links: [
        { href: '/faq', label: 'FAQ', description: 'Frequently asked questions' },
        { href: '/contact', label: 'Contact Us', description: 'Get in touch with us' },
      ],
    },
    {
      category: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy', description: 'Our privacy practices' },
        { href: '/terms', label: 'Terms of Service', description: 'Terms and conditions' },
      ],
    },
  ]

  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sitemap</h1>
        <p className="text-muted-foreground mb-12">
          A complete directory of all pages available on SpeedTest.
        </p>

        <div className="space-y-8">
          {siteStructure.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.category}</h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="group block p-4 bg-card border border-border rounded-lg hover:border-primary transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                            {link.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        </div>
                        <svg
                          className="w-5 h-5 text-muted-foreground group-hover:text-primary transition transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* XML Sitemap Info */}
        <div className="mt-12 bg-muted border border-border rounded-lg p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">XML Sitemap</h2>
          <p className="text-muted-foreground mb-4">
            Search engines can access our XML sitemap at:
          </p>
          <code className="block bg-background p-4 rounded border border-border text-primary break-all">
            /sitemap.xml
          </code>
          <p className="text-sm text-muted-foreground mt-4">
            This helps search engines discover and index all pages on SpeedTest.
          </p>
        </div>

        {/* Related Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-foreground mb-2">Start Speed Test</h3>
              <p className="text-sm text-muted-foreground">
                Test your internet connection now
              </p>
            </Link>

            <Link
              href="/faq"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-foreground mb-2">FAQ</h3>
              <p className="text-sm text-muted-foreground">
                Common questions about internet speeds
              </p>
            </Link>

            <Link
              href="/about"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-foreground mb-2">About SpeedTest</h3>
              <p className="text-sm text-muted-foreground">
                Learn our mission and values
              </p>
            </Link>

            <Link
              href="/contact"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-foreground mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch with our team
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
