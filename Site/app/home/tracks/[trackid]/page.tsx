"use server";

import styles from "./tracks.module.css";
import { YouTubeResponse } from "@/types/youtubeAPI";

/**
 * Pagina dei Dettagli Traccia (Server Component).
 *
 * Questo componente asincrono recupera i metadati e l'URL di streaming di una traccia
 * specifica di SoundCloud utilizzando il suo ID.
 *
 * Funzionalità chiave:
 * 1. Estrae l'ID della traccia dai parametri della rotta (gestendo la Promise asincrona di Next.js).
 * 2. Autentica la richiesta sia per i metadati che per lo stream audio con il clientID.
 * 3. Seleziona e prepara l'URL dello stream 'progressive' per la riproduzione nativa.
 *
 * @param {Promise<{ trackid: string }>} params Una Promise che si risolve con i parametri
 * dinamici della rotta (trackid). Il valore risolto è un oggetto.
 * @returns {JSX.Element | JSX.Element} Il componente React che visualizza i dettagli della traccia o un messaggio di errore.
 */

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackid: string }>;
}) {
  const { trackid } = await params;
  let result: YouTubeResponse;
  let thumbnail: string = "";
  let title: string = "";
  let description: string = "";
  let trackDuration: number = 0;

  console.log(trackid)

    const response = await fetch(`http://localhost:3000/api/search?id=${trackid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      result = await response.json();
      thumbnail = result.items ? result.items[0].snippet?.thumbnails?.high?.url || "/defaultSongThumbnail.png" : "/defaultSongThumbnail.png";
      title = result.items ? result.items[0].snippet?.title || "Unknown Title" : "Unknown Title";
      description = result.items ? result.items[0].snippet?.description || "No Description" : "No Description";
    } else {
      const error = await response.json();
      console.error(error.message);
    }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridElement}>
        <img src={thumbnail} alt={title} />
        <h1>{title}</h1>
      </div>
      <div className={styles.gridElement}>
        <audio src={`/api/song-stream?id=${trackid}`} controls />
        <p>{description}</p>
      </div>
    </div>
  );
}
