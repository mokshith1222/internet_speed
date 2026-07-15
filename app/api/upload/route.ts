export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    // Consume the request body natively in C++ (uses 0ms JS CPU time, avoiding Vercel's 50ms Edge timeout)
    await request.arrayBuffer()
    
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
