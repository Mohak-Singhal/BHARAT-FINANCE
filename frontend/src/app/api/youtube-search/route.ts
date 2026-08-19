import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ParsedVideo {
  id: string
  title: string
  thumbnail: string
  channel: string
  url: string
  publishedAt?: string
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || ''
  const maxResults = Math.min(parseInt(request.nextUrl.searchParams.get('maxResults') || '10', 10) || 10, 20)

  if (!query.trim() || query.length > 200) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: `YouTube request failed: ${response.status}` }, { status: 502 })
    }

    const html = await response.text()
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)

    if (!match) {
      return NextResponse.json({ error: 'Could not parse YouTube response' }, { status: 502 })
    }

    const json = JSON.parse(match[1])
    const sections =
      json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []

    const videos: ParsedVideo[] = []

    for (const section of sections) {
      const items = section?.itemSectionRenderer?.contents || []
      for (const item of items) {
        const v = item?.videoRenderer
        if (!v?.videoId) continue

        const thumbnailUrl = v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url || ''
        const thumbnail = thumbnailUrl.startsWith('http')
          ? thumbnailUrl
          : `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`

        videos.push({
          id: v.videoId,
          title: v.title?.runs?.[0]?.text || 'Untitled',
          thumbnail,
          channel: v.ownerText?.runs?.[0]?.text || 'Unknown',
          url: `https://www.youtube.com/watch?v=${v.videoId}`,
          publishedAt: v.publishedTimeText?.simpleText || '',
        })
      }
      if (videos.length >= maxResults) break
    }

    if (videos.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 })
    }

    return NextResponse.json({ videos: videos.slice(0, maxResults) })
  } catch (error) {
    return NextResponse.json({ error: 'YouTube search failed' }, { status: 500 })
  }
}