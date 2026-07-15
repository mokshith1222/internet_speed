export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '5242880') // Default 5MB

  // Clamp size between 1MB and 25MB to prevent abuse
  const clampedSize = Math.max(1024 * 1024, Math.min(size, 25 * 1024 * 1024))

  // Define a reasonable chunk size for streaming
  const chunkSize = 131072 // 128KB chunks
  let bytesSent = 0

  // Create a ReadableStream that generates fresh random bytes on every pull.
  // This makes the payload completely uncompressible (preventing gzip/brotli bypass),
  // while keeping CPU usage low because we generate in 128KB blocks.
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesSent >= clampedSize) {
        controller.close()
        return
      }

      const remaining = clampedSize - bytesSent
      const currentChunkSize = Math.min(chunkSize, remaining)
      
      const chunk = new Uint8Array(currentChunkSize)
      // crypto.getRandomValues is extremely fast natively in V8
      crypto.getRandomValues(chunk)
      
      controller.enqueue(chunk)
      bytesSent += currentChunkSize
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': clampedSize.toString(),
      // Force proxies and browsers to disable compression and caching
      'Content-Encoding': 'identity',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  })
}
