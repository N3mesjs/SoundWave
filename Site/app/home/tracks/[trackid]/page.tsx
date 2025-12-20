"use server";

import { resumePluginState } from "next/dist/build/build-context";
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

    const response = await fetch(`/api/search?query=${trackid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      result = await response.json();
    } else {
      const error = await response.json();
      console.error(error.message);
    }
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridElement}>
        <img src={result.} alt={track.title} />
        <h1>{track.title}</h1>
      </div>
      <div className={styles.gridElement}>
        {/* <p>{track.description}</p> */}
        <audio src={`/api/song-stream?query=${trackid}`} controls />
        {/* <p>Duration: {formatDuration(track.duration)}</p>
        <p>Plays: {track.playback_count}</p>
        <p>Likes: {track.likes_count}</p> */}
      </div>
    </div>
  );
}
