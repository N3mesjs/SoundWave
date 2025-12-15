import styles from './search.module.css'

import Link from 'next/link'
import Image from 'next/image'

export default async function SearchPage({
    params, 
}: {
    params: Promise<{ query: string }>
}) {
  const { query } = await params;
  let results: [];

  const response = await fetch(`http://localhost:3000/api/search?query=${query}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});

  if (response.ok) {
    const data = await response.json();
    results = data.collection;
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
            {results.length !== 0
              ? results.map((song: any, i: number) => {
                  console.log(song);
                  return (
                    <li key={i} className={styles.listElement}>
                      <Link href={`/home/tracks/${song.id}`} className={styles.songElement}>
                        <div className={styles.imgContainer}>
                          <Image src={song.artwork_url ? song.artwork_url : "/default/defaultSoungThumbnail.png"} alt="song cover" fill />
                        </div>
                        <div className={styles.songTitle}><h3>{song.title}</h3><span>{song.publisher_metadata?.artist}</span></div>
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
