export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '5242880') // Default 5MB

  // Clamp size between 1MB and 25MB
  const clampedSize = Math.max(1024 * 1024, Math.min(size, 25 * 1024 * 1024))

  // Pre-generate a 64KB random buffer once per request (very fast, low memory)
  const chunkSize = 65536
  const chunk = new Uint8Array(chunkSize)
  crypto.getRandomValues(chunk)

  // Construct the stream repeating the generated chunk
  let bytesSent = 0
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesSent >= clampedSize) {
        controller.close()
        return
      }
      const remaining = clampedSize - bytesSent
      if (remaining >= chunkSize) {
        controller.enqueue(chunk)
        bytesSent += chunkSize
      } else {
        controller.enqueue(chunk.subarray(0, remaining))
        bytesSent += remaining
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': clampedSize.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
