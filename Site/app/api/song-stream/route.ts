import { type NextRequest } from "next/server";
import YTDlpWrap from "yt-dlp-wrap";
import { Readable } from "stream";
import { join } from "path";

const binaryPath = join("/", "usr", "bin", "yt-dlp");
const ytdlp = new YTDlpWrap(binaryPath);

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const range = request.headers.get("range"); // Es: "bytes=1000-"
    const url = `https://www.youtube.com/watch?v=${id}`;

    const videoInfo = await ytdlp.getVideoInfo(url);
    const format = videoInfo.formats
      .filter((f) => f.ext === "m4a" && f.vcodec === "none")
      .sort((a, b) => (a.abr || 0) - (b.abr || 0))
      .pop();

    const fileSize = format.filesize || format.filesize_approx;
    const duration = videoInfo.duration; // Durata in secondi

    // --- LOGICA DI SEEKING (ORTODOSSA) ---
    let startByte = 0;
    if (range) {
      startByte = Number(range.replace(/\D/g, ""));
    }

    // Convertiamo i byte richiesti in secondi per yt-dlp
    const startSeconds = (startByte / fileSize) * duration;

    const readableStream = ytdlp.execStream([
      url,
      "-f", "bestaudio[ext=m4a]",
      "--download-sections", `*${startSeconds}-inf`, // Inizia dal secondo calcolato
      "--force-keyframes-at-cuts",
      "--js-runtimes", "node",
    ]);

    const stream = Readable.toWeb(readableStream);

    // Risposta 206 (Partial Content) se c'è un range, altrimenti 200
    const status = range ? 206 : 200;

    const headers: any = {
      "Content-Type": "audio/m4a",
      "Accept-Ranges": "bytes",
      "Content-Length": (fileSize - startByte).toString(),
    };

    if (range) {
      headers["Content-Range"] = `bytes ${startByte}-${fileSize - 1}/${fileSize}`;
    }

    return new Response(stream as ReadableStream, { status, headers });

  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}