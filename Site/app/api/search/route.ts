import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')
  console.log(query);
  if (!query) {
    return Response.json(
      { message: query },
      {
        status: 500,
      }
    );
  } else {
    const response = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${process.env.SOUNDCLOUD_CLIENTID}&access=playable&limit=5`);
    const data = await response.json();
    return Response.json(
      { message: data },
      {
        status: 200,
      }
    );
  }
}

