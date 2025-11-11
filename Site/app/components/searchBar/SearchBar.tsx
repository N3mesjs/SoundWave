"use client";

import styles from "./SearchBar.module.css";

import { useEffect, useState, ChangeEvent } from "react";
import useDebounce from "../../hooks/useDebounce";
import { text } from "stream/consumers";

export default function SearchBar() {
    const [textArea, setTextArea] = useState<string>("");
    const [results, setResults] = useState<[]>([]);

    const debounceValue = useDebounce(textArea, 1000)

    useEffect(() => {

      const fetchResults = async () => {
        const response = await fetch(`api/search/${debounceValue}`);
        const data = response.json();
        console.log(data.message)
      }

      if(debounceValue !== ""){
        fetchResults();
      }
    }, [debounceValue])

  return (
    <div className={styles.searchArea}>
      <div className={styles.searchContainer}>
        <input placeholder="What do you want to play? ...." value={textArea} onChange={(e: ChangeEvent<HTMLInputElement>) => setTextArea(e.target.value)}/>
        <div className={styles.resultsContainer}>
          wad
        </div>
      </div>
    </div>
  );
}
