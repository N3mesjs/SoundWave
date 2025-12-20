"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import styles from "./SearchBar.module.css";

import React, { useEffect, useState, ChangeEvent } from "react";
import useDebounce from "../../hooks/useDebounce";
import { YouTubeResponse } from "@/types/youtubeAPI";

/**
 * Barra di Ricerca (Client Component).
 *
 * Questo componente consente agli utenti di cercare tracce utilizzando
 * l'API interna di ricerca. Implementa una funzionalità di debounce
 * per ottimizzare le richieste di rete e visualizza i risultati
 * della ricerca in un menu a discesa.
 * @returns {JSX.Element}
 */

export default function SearchBar() {
  const [textArea, setTextArea] = useState<string>("");
  const [results, setResults] = useState<YouTubeResponse>({});

  const debounceValue = useDebounce(textArea, 1000);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/search?query=${debounceValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        console.log(results);
        //console.log(results)
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    };

    if (debounceValue !== "") {
      fetchResults();
    } else {
      setResults({});
    }
  }, [debounceValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (results.pageInfo?.resultsPerPage !== 0) {
      setTextArea("");
      redirect(`/home/search/${textArea}`);
    }
  };

  return (
    <div className={styles.searchArea}>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="What do you want to play? ...."
            value={textArea}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTextArea(e.target.value)
            }
          />
          <button type="submit" />
        </form>
        <div
          className={`${styles.resultsContainer} ${
            results.pageInfo?.resultsPerPage !== 0 && textArea !== ""
              ? styles.show
              : ""
          }`}
        >
          <ul className={styles.songsList}>
            {results.items?.length !== 0
              ? results.items?.slice(0, 4).map((song: any, i: number) => {
                  return (
                    <Link
                      href={`/home/tracks/${song.id.videoId}`}
                      className={styles.songElement}
                      onClick={() => setTextArea("")}
                      key={i}
                    >
                      <li key={i} className={styles.listElement}>
                        <div className={styles.imgContainer}>
                          <Image
                            src={song.snippet?.thumbnails?.default?.url}
                            alt="song cover"
                            fill
                          />
                        </div>
                        <div className={styles.songTitle}>
                          <h3>{song.title}</h3>
                          <span>{song.snippet?.channelTitle}</span>
                        </div>
                      </li>
                    </Link>
                  );
                })
              : " "}
          </ul>
        </div>
      </div>
    </div>
  );
}
