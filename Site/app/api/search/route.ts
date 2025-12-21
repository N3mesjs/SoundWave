import { type NextRequest } from "next/server";

/**
 * Gestore della rotta API GET per la ricerca di tracce su SoundCloud.
 *
 * Questa rotta funge da proxy (BFF) per nascondere la chiave API di SoundCloud (clientID)
 * e gestire la logica di errore prima di inoltrare la richiesta.
 *
 * @param {NextRequest} request L'oggetto Request fornito da Next.js contenente l'URL e gli headers.
 * @returns {Response} Una risposta JSON contenente i risultati di SoundCloud o un messaggio di errore.
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const videoID = searchParams.get("id");

  const clientID = process.env.YOUTUBE_API_KEY;
  const youtubeAPIURL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&key=${clientID}`;
  const youtubeAPIURL_videoID = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoID}&key=${clientID}`;

  if (!query && !videoID) {
    return Response.json(
      { message: "Missing query/videoID!" },
      {
        status: 400,
      }
    );
  }

  if (!clientID) {
    return Response.json(
      { message: "Missing client ID" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  /**
   * Logica per gestire le richieste API in base ai parametri forniti.
   * Se è presente 'query', effettua una ricerca.
   * Se è presente 'videoID', recupera i dettagli del video specifico.
   */

  if (query) {
    const response = await fetch(youtubeAPIURL);

    if (response.ok) {
      const data = await response.json();
      return Response.json(data, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return Response.json(
        { message: "The API request didn't succede", type: "search with query" },
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } else if (videoID) {
    const response = await fetch(youtubeAPIURL_videoID);

    if (response.ok) {
      const data = await response.json();
      return Response.json(data, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return Response.json(
        { message: "The API request didn't succede", type: "search with videoID" },
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
