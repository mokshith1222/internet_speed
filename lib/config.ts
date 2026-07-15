export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL 
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '') 
  : 'https://veloci-pi.vercel.app'
