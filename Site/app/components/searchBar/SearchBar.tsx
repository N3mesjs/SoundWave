"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import styles from "./SearchBar.module.css";

import React, { useEffect, useState, ChangeEvent } from "react";
import useDebounce from "../../hooks/useDebounce";

export default function SearchBar() {
  const [textArea, setTextArea] = useState<string>("");
  const [results, setResults] = useState<[]>([]);

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
        setResults(data.collection);
        //console.log(results)
      }
    };

    if (debounceValue !== "") {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [debounceValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (results.length !== 0) {
      setTextArea("");
      redirect(`/home/search/${debounceValue}`);
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
            results.length !== 0 && textArea !== "" ? styles.show : ""
          }`}
        >
          <ul className={styles.songsList}>
            {results.length !== 0
              ? results.map((song: any, i: number) => {
                  return (
                    <li key={i} className={styles.listElement}>
                      <Link
                        href={`/home/tracks/${song.id}`}
                        className={styles.songElement}
                        onClick={() => setTextArea("")}
                      >
                        <div className={styles.imgContainer}>
                          <Image src={song.artwork_url} alt="song cover" fill />
                        </div>
                        <div className={styles.songTitle}>
                          <h3>{song.title}</h3>
                          <span>{song.publisher_metadata?.artist}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })
              : " "}
          </ul>
        </div>
      </div>
    </div>
  );
}
