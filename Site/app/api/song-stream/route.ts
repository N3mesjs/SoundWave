import { type NextRequest } from "next/server";
import YTDlpWrap from "yt-dlp-wrap";
import { Readable } from "stream";
import { join } from "path";

const binaryPath = join("/", "usr", "bin", "yt-dlp");
const ytdlp = new YTDlpWrap(binaryPath);

export async function GET(request: NextRequest) {
  try {
    const videoID = request.nextUrl.searchParams.get("id");
    const range = request.headers.get("range"); // Es: "bytes=1000-"
    const url = `https://www.youtube.com/watch?v=${videoID}`;

    const videoInfo = await ytdlp.getVideoInfo(url);
    const format = videoInfo.formats
      .filter((f) => f.ext === "m4a" && f.vcodec === "none")
      .sort((a, b) => a.abr - b.abr)
      .pop();
    
    const audioURL = format.url

    /**
     * N.B. Non si utilizza il metodo .getReader dal body del fetch
     * dato che:
     * 1) riceviamo gia una readable stream! quindi non ha senso lavorare
     *    nei singoli chunk!
     * 2) non dobbiamo manipolare i singoli chunk e quindi accedere alla proprieta
     *    .read e gestire i vari chunk.
     * 
     * Il tutto e possibile solo perche youtube fornisce url con audio completo
     * se no non era possibile
     */
    const stream = await fetch(audioURL, {
      headers: {
        'Content-Type': 'audio/m4a',
        'Range': `${range}`
      }
    })

    return new Response(stream.body, {
      status: 206,
      headers: {
        "Content-Type": 'audio/m4a',
        "Accept-Range": 'bytes',
        "Content-Range": stream.headers.get('Content-Range') || "",
        "Content-Length": stream.headers.get('Content-Lenght') || ""
      }
    })

    /**
     * The code below is for streaming with the yt-dlp stream method
     */

    //const duration = videoInfo.duration;
    // const readableStream = ytdlp.execStream([
    //   url,
    //   "-f", "bestaudio[ext=m4a]",
    //   "--download-sections", `*${startSeconds}-inf`,
    //   "--force-keyframes-at-cuts",
    //   "--js-runtimes", "node",
    // ]);

    //const stream = Readable.toWeb(readableStream);

    // return new Response(stream as ReadableStream, {
    //   status: 206,
    //   headers: {
    //     "Content-Type": "audio/m4a",
    //     "Accept-Ranges": "bytes",
    //     "Content-Length": `${fileSize}`,
    //     "Content-Range": `bytes ${startByte}-${fileSize}/${fileSize}`,
    //   },
    // });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
