import { type NextRequest } from "next/server";
import YTDlpWrap from "yt-dlp-wrap";
import { Readable } from "stream";
import { join } from "path";

const binaryPath = join("/", "usr", "bin", "yt-dlp");
const ytdlp = new YTDlpWrap(binaryPath);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const range = request.headers.get("range");
    const url = `http://www.youtube.com/watch?v=${id}`;

    const videoInfo = await ytdlp.getVideoInfo(url);
    const formatsInfo = videoInfo.formats
      .filter(
        (f) => f.ext === "m4a" && f.vcodec === "none" && f.acodec !== "none"
      )
      .sort((a, b) => (a.abr || 0) - (b.abr || 0))
      .pop();

    const fileSize = formatsInfo.filesize_approx;
    
    const readableStream = ytdlp.execStream([
      url,
      "-f", "bestaudio[ext=m4a]",
      "--js-runtimes", "node",
    ]);

    readableStream.on("error", (error) => {
      console.error("Stream error:", error);
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
    readableStream.on("end", () => {
      console.log("Stream ended");
    });

    const stream = Readable.toWeb(readableStream);

    return new Response(stream as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/m4a",
        "Transfer-Encoding": "chunked",
        // "Content-Length": fileSize.toString(),
        // "Accept-Ranges": "none", // <--- Questo impedisce al browser di "impallarsi"
        // "Cache-Control": "no-cache",
      },
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
