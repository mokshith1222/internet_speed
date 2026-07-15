export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const arrayBuffer = await request.arrayBuffer()
    
    return new Response(
      JSON.stringify({
        success: true,
        size: arrayBuffer.byteLength,
      }),
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
