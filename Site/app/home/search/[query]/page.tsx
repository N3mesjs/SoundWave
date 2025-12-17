import styles from "./search.module.css";

import Link from "next/link";
import Image from "next/image";

import { YouTubeResponse } from "@/types/youtubeAPI";

/**
 * Pagina di Ricerca (Server Component).
 *
 * Questo componente asincrono recupera i risultati della ricerca da
 * l'API interna di ricerca e visualizza una lista di tracce corrispondenti
 * alla query di ricerca fornita nei parametri della rotta.
 *
 * Funzionalità chiave:
 * 1. Estrae la query di ricerca dai parametri della rotta (gestendo la Promise asincrona di Next.js).
 * 2. Effettua una richiesta all'API interna per ottenere i risultati della ricerca.
 * 3. Visualizza i risultati in una lista con link ai dettagli di ciascuna traccia.
 * @param {Promise<{ query: string }>} params Una Promise che si risolve con i parametri
 * dinamici della rotta (query). Il valore risolto è un oggetto.
 * @returns {JSX.Element}
 */

export default async function SearchPage({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;
  let results: YouTubeResponse = {};

  const response = await fetch(
    `http://localhost:3000/api/search?query=${query}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.ok) {
    const data = await response.json();
    results = data;
  } else {
    const data = await response.json();
    console.error(data.message);
  }

  return (
    <>
      <div>
        <h1 className={styles.title}>Songs List</h1>
        <hr />
        <ul className={styles.songsList}>
          {results.items && results.items.length >0 ? results.items.map((song: any, i: number) => {
                console.log(song);
                return (
                  <li key={i} className={styles.listElement}>
                    <Link
                      href={`/home/tracks/${song.id.videoId}`}
                      className={styles.songElement}
                    >
                      <div className={styles.imgContainer}>
                        <Image
                          src={
                            song.snippet?.thumbnails?.default?.url
                              ? song.snippet?.thumbnails?.default?.url
                              : "/default/defaultSoungThumbnail.png"
                          }
                          alt="song cover"
                          fill
                        />
                      </div>
                      <div className={styles.songTitle}>
                        <h3>{song.snippet?.title}</h3>
                        <span>{song.snippet?.channelTitle}</span>
                      </div>
                    </Link>
                  </li>
                );
              })
            : " "}
        </ul>
      </div>
    </>
  );
}
