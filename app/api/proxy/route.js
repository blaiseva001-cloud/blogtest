export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  
  if (!imageUrl) {
    return new Response('URL parameter is required', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBuffer = await response.arrayBuffer()
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    return new Response('Image not found', { status: 404 })
  }
}