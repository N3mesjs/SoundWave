"use server";

import styles from "./tracks.module.css";

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes + ' minutes ' +seconds + ' seconds'}`;
}

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
  let track;
  let trackAudioURL = "";

  const response = await fetch("/api/song-stream", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    track = await response.json();
    console.log(track);

    let transcodingURL: string;

    // Extract the progressive stream URL
    track.media.transcodings.forEach((transcoding: any) => {
      if (transcoding.format.protocol === "progressive") {
        transcodingURL = `${transcoding.url}?client_id=${clientID}`;
      }
    });

    // Fetch the actual audio URL
    const transcodingResponse = await fetch(transcodingURL);
    trackAudioURL = (await transcodingResponse.json()).url;
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridElement}>
        <img src={track.artwork_url} alt={track.title} />
        <h1>{track.title}</h1>
      </div>
      <div className={styles.gridElement}>
        <p>{track.description}</p>
        <audio src={trackAudioURL} controls />
        <p>Duration: {formatDuration(track.duration)}</p>
        <p>Plays: {track.playback_count}</p>
        <p>Likes: {track.likes_count}</p>
      </div>
    </div>
  );
}
