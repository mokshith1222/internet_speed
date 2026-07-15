export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    // Consume the request stream fully to measure upload throughput
    if (request.body) {
      const reader = request.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
      }
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Upload failed' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
