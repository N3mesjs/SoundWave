import { type NextRequest } from "next/server";
import pgk from "yt-dlp-wrap";
import { Readable } from "stream";
import { join } from 'path';

const YTDlpWrap = (pgk as any).default;
const binaryPath = join('/', 'usr', 'bin', 'yt-dlp');
const ytdlp = new YTDlpWrap(binaryPath);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const range = request.headers.get("range");
    const url = `http://www.youtube.com/watch?v=ZjBLbXUuyWg`;
    
    let readableStream = ytdlp.execStream([
        url,
        '-f', 
        'bestaudio[ext=m4a]',
        '--js-runtimes', 'node',
    ]);

    readableStream.on('error', (error) => {
      console.error('Stream error:', error);
      return Response.json(
        { message: "Error streaming audio" },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    readableStream.on('end', () => {
      console.log('Stream ended');
    });



    // readableStream.pipe(createWriteStream('test.m4a'));

    const stream = Readable.toWeb(readableStream);

    return new Response(stream as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/m4a",
        "Transfer-Encoding": "chunked",
      }
    });

  } catch (error) {
    return Response.json(
      { message: error.message || "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
