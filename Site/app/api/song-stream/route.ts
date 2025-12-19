import { type NextRequest } from "next/server";
import { Innertube } from 'youtubei.js';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const  range = request.headers.get("range");
    //const url = `http://www.youtube.com/watch?v=${query}`;
    const videoID = `aqz-KE-bpKQ`;

    const innertube = await Innertube.create(/* options */);
    const info = await innertube.getBasicInfo(videoID);
    const format = info.chooseFormat({
      type: 'audio', 
      quality: 'best',
    })
    const fileSize: number = format?.content_length;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = range ? Number(range?.replace(/\D/g, '')) : 0; //Replace non-digits to get the start byte with global flag
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1); //Calculate the end byte of the chunk, -1 because it starts from 0
    const contentLength = end - start + 1; //Calculate content length of the chunk +1 because both start and end are inclusive, so from 0 to 9999 is 10000 bytes

    const stream = await innertube.download(videoID, {
      format: 'audio',
      range: { start, end }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${fileSize}`, //Indicate the range of bytes being sent and the total file size
        "Content-Length": contentLength.toString(),
      },
      status: 206,
    });
  } catch (error) {
    return Response.json(
      { message: error.message || 'Internal Server Error' },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
