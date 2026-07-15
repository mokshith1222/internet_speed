# Google AdSense & Monetization Setup Guide

This guide will help you set up Google AdSense and prepare your SpeedTest website for monetization.

## Prerequisites
- A Google account
- Your website deployed to a public domain
- This SpeedTest application

## Step 1: Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Enter your domain name
4. Verify ownership using the HTML file method:
   - Download the verification file from Google
   - Place it in the `public/` folder of your project
   - Our file is already at: `public/googlefbfa23743896d7f7.html`
5. Submit your sitemap: `yourdomain.com/sitemap.xml`
6. Wait for Google to index your site (can take 1-2 weeks)

## Step 2: Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Sign in with your Google account"
3. Enter your website URL
4. Complete the application:
   - Provide personal information
   - Confirm your website complies with AdSense policies
   - Accept the terms and conditions
5. Google will review your application (typically 3-5 business days)

### AdSense Compliance Requirements
- Original, unique content (we have extensive SEO content)
- Clear privacy policy (included at `/privacy`)
- Clear terms of service (included at `/terms`)
- Disclaimer page (included at `/disclaimer`)
- Contact information visible (footer has contact email)
- No clicks/impressions before approval
- Content must be family-safe and appropriate

## Step 3: Configure AdSense in Your Application

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Replace `YOUR_ADSENSE_ID` with your AdSense Publisher ID:
   - Go to [AdSense Settings](https://adsense.google.com/u/0/myads/settings)
   - Find your Publisher ID (format: ca-pub-xxxxxxxxxxxxxxxx)
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_ADSENSE_ID=ca-pub-1234567890123456
     ```

3. Update the AdSense script in `app/layout.tsx`:
   - Find the line: `src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"`
   - Replace `YOUR_ADSENSE_ID` with your actual Publisher ID

## Step 4: Deploy to Production

1. Deploy your application to Vercel or another hosting provider
2. Ensure your domain is properly configured
3. Test that AdSense scripts are loading correctly
4. Monitor AdSense dashboard for impressions and clicks

## Important: What NOT to Do (AdSense Violations)

- Do NOT click your own ads
- Do NOT encourage users to click ads
- Do NOT place ads where they're not visible
- Do NOT manipulate traffic artificially
- Do NOT use invalid traffic sources
- Do NOT place multiple ads too close together
- Do NOT use misleading content
- Do NOT violate any AdSense policies

## Page Structure for Monetization

Your website includes all recommended pages for AdSense compliance:

### Required Pages (Already Implemented)
- ✓ Homepage with unique content
- ✓ Privacy Policy (`/privacy`)
- ✓ Terms of Service (`/terms`)
- ✓ Disclaimer (`/disclaimer`)
- ✓ Contact Information (footer + `/contact`)

### Optional Pages (Already Implemented)
- ✓ About page (`/about`)
- ✓ FAQ page (`/faq`)
- ✓ Sitemap (`/sitemap`)
- ✓ Sitemap XML (`/sitemap.xml`)

## Monitoring & Optimization

### Check Your AdSense Performance
1. Log in to [AdSense Dashboard](https://adsense.google.com)
2. Monitor:
   - Impressions: Number of times ads are shown
   - Clicks: Number of times users click ads
   - CTR (Click-Through Rate): % of impressions that get clicked
   - RPM (Revenue Per Thousand): Earnings per 1000 impressions

### Tips to Increase Earnings
- Write more original, high-quality content (we have 1500+ words)
- Focus on high-CPC keywords (speed test related keywords are valuable)
- Improve website traffic and SEO
- Place ads in visible, non-intrusive locations
- Ensure mobile optimization (our site is fully responsive)
- Keep bounce rate low with engaging content
- Update content regularly

## Troubleshooting

### AdSense Not Loading
- Clear browser cache
- Check if JavaScript is enabled
- Verify Publisher ID is correct
- Wait 24 hours after adding AdSense code

### Low CTR or RPM
- Check if ads are properly visible
- Ensure content matches ad interests
- Monitor for ad fraud or invalid traffic
- Review AdSense policies compliance

### Application Rejected
- Ensure website has original content (we have extensive content)
- Add all required policy pages (we have them)
- Remove any copyrighted content
- Wait 30 days and reapply
- Check AdSense blog for policy updates

## Additional Resources

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense Code Implementation Guide](https://support.google.com/adsense/answer/181947)
- [Google Search Console Guide](https://support.google.com/webmasters)

## Support

For questions about AdSense setup, contact Google support directly:
- Email: support@google.com
- Or use the contact form at mokshithnaik67@gmail.com (for website-related questions)
