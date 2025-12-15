import { type NextRequest } from 'next/server'

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
  const query = searchParams.get('query');
  
  const clientID = process.env.SOUNDCLOUD_CLIENTID
  const soundcloudAPIUrl = `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${clientID}&access=playable&limit=20`
  console.log(query);
  if (!query) {
    return Response.json(
      { message: "Missing query!" },
      {
        status: 400,
      }
    );
  }

  if (!clientID) {
  return Response.json(
    { message: "Missing SoundCloud client ID" },
    { 
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

  const response = await fetch(soundcloudAPIUrl);

  if(response.ok){
    const data = await response.json();
    return Response.json(data, 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } else {
    return Response.json(
      { message:  "The API request didn't succede"},
      {
        status: 502,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}

