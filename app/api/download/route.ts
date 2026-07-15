export const runtime = 'nodejs'

export async function GET(request: Request) {
  // Generate random binary data of specified size
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '10485760') // Default 10MB

  // Clamp size between 1MB and 100MB
  const clampedSize = Math.max(1024 * 1024, Math.min(size, 100 * 1024 * 1024))

  // Use crypto for fast random data generation instead of a slow loop
  const { randomBytes } = await import('crypto')
  const data = randomBytes(clampedSize)

  return new Response(data, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': clampedSize.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
