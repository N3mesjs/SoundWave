import { type NextRequest } from "next/server";

import ytdl from "ytdl-core";
import { Readable } from "node:stream";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const  range = request.headers.get("range");

    let info = await ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ");

    const nodejsStream = ytdl("http://www.youtube.com/watch?v=aqz-KE-bpKQ", {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const webStream = Readable.toWeb(nodejsStream) as ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
      status: 206,
    });
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
