export async function GET(
  _request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params;
  console.log(query);
  if (!query) {
    return Response.json(
      { message: query },
      {
        status: 500,
      }
    );
  } else {
    return Response.json(
      { message: query },
      {
        status: 200,
      }
    );
  }
}

// https://api-v2.soundcloud.com/tracks?q=${process.env.SOUNDCLOUD_CLIENTID}&access=playable&limit=3
