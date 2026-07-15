# SpeedTest - Fast Internet Speed Checker

A modern, fast, and reliable internet speed testing platform built with Next.js 16, React 19, and Tailwind CSS.

## Features

✨ **Modern Design**
- Clean, intuitive interface with light and dark mode support
- Fully responsive design for mobile, tablet, and desktop
- Smooth animations and transitions

⚡ **Speed Testing**
- Download speed measurement in Mbps
- Upload speed measurement in Mbps
- Ping (latency) measurement in milliseconds
- Jitter (connection stability) calculation
- Percent-based quality rating system

🔒 **Privacy First**
- No login required
- No data collection or tracking
- No persistent storage of test results
- 100% secure and private testing

📱 **User Experience**
- Fast results in 30-60 seconds
- Expandable FAQ section with 20+ questions
- Contact form with email support
- Detailed About page with 2000+ words

📄 **Comprehensive Information**
- About page explaining the service and mission
- Privacy Policy page
- Terms of Service page
- Contact page with support information
- FAQ page with searchable questions
- Sitemap for easy navigation

🔍 **SEO Optimized**
- XML sitemap generation
- Robots.txt configuration
- Structured metadata and keywords
- Open Graph and Twitter Card support
- Semantic HTML structure

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
app/
├── layout.tsx                 # Root layout with header and footer
├── page.tsx                   # Home page with speed test tool
├── about/
│   └── page.tsx              # About page (2000+ words)
├── privacy/
│   └── page.tsx              # Privacy Policy page
├── terms/
│   └── page.tsx              # Terms of Service page
├── contact/
│   └── page.tsx              # Contact page with form
├── faq/
│   └── page.tsx              # FAQ page with 20+ questions
├── sitemap/
│   └── page.tsx              # Sitemap page
├── api/
│   └── ping/
│       └── route.ts          # Ping test endpoint
├── sitemap.xml/
│   └── route.ts              # XML sitemap for SEO
└── globals.css               # Global styles and design tokens

components/
├── theme-provider.tsx         # Dark/Light mode provider
├── header.tsx                 # Navigation header
├── footer.tsx                 # Footer with links
└── speed-test.tsx            # Main speed test component

public/
└── robots.txt                 # Robots configuration for search engines
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## Features Breakdown

### Speed Test Tool
- **Download Speed**: Measures data transfer from internet to device
- **Upload Speed**: Measures data transfer from device to internet
- **Ping**: Measures round-trip latency to test servers
- **Jitter**: Calculates variation in connection stability
- **Progress Indicator**: Real-time visual feedback during testing
- **Quality Ratings**: Color-coded results with performance assessment

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference using localStorage
- System preference detection on first visit
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Adaptive navigation menu

### SEO Optimization
- Meta tags for all pages
- XML sitemap generation
- Robots.txt configuration
- Open Graph support for social sharing
- Semantic HTML structure
- Keywords and descriptions for all content

## Pages

### Speed Test (/)
Main landing page with the interactive speed test tool, feature cards, and explanations of different metrics.

### About (/about)
Comprehensive page explaining SpeedTest's mission, why it was created, technology stack, privacy practices, and future roadmap. Contains 2000+ words of valuable content.

### FAQ (/faq)
Frequently asked questions about internet speeds, SpeedTest features, and troubleshooting. Includes 20+ expandable questions with detailed answers. Features SEO keywords and common user queries.

### Contact (/contact)
Contact form for user inquiries with email field, name, subject, and message. Displays contact information and response time expectations.

### Privacy Policy (/privacy)
Detailed privacy policy covering data collection, usage, retention, security, GDPR rights, and compliance information.

### Terms of Service (/terms)
Complete terms and conditions for using SpeedTest, including liability limitations, user conduct, and legal information.

### Sitemap (/sitemap)
User-friendly sitemap page with links to all major sections and pages on the website.

## Dark Mode Implementation

The theme provider uses:
- localStorage for persistence
- System preference detection (prefers-color-scheme)
- Smooth CSS transitions
- Complete design token coverage for both themes

To toggle dark mode, click the theme button in the header (sun/moon icon).

## SEO Keywords

Primary Keywords:
- Internet speed test
- Speed checker
- Bandwidth test
- Connection test
- Download speed
- Upload speed
- Ping test
- Internet speed checker
- Connection speed test
- ISP speed test

Long-tail Keywords:
- Fast internet speed test
- Accurate speed checker
- Download speed test
- Upload speed measurement
- Ping latency test
- Internet connection quality
- Network speed test
- WiFi speed test
- Fiber speed test

## Performance Metrics

The website includes quality ratings based on:
- **Download**: 100+ Mbps (Excellent) to <10 Mbps (Poor)
- **Upload**: 50+ Mbps (Excellent) to <5 Mbps (Poor)
- **Ping**: <20ms (Excellent) to >150ms (Poor)
- Visual progress bars showing percentage quality

## Contact

- **Email**: mokshithnaik67@gmail.com
- **Response Time**: 24-48 hours
- **Support**: Available 24/7

## Deployment

Deploy to Vercel with a single click:

```bash
vercel
```

Or manually deploy:
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables if needed
4. Deploy automatically on push

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is provided as-is for educational and commercial use.

## Future Enhancements

Planned features:
- Advanced network diagnostics
- Historical trend analysis
- AI-powered insights
- Integration with smart home systems
- Mobile app version
- API for third-party integrations
- Speed test history per user
- Detailed network reports

## Contributing

For feedback, suggestions, or issues, please contact: mokshithnaik67@gmail.com

---

Built with ❤️ for accurate internet speed testing.
