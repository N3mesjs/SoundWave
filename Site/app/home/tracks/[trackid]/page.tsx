"use server"

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackid: string }>
}) {

  const { trackid } = await params
  const clientID = process.env.SOUNDCLOUD_CLIENTID
  const url = `https://api-v2.soundcloud.com/tracks/${trackid}?client_id=${clientID}`;
  let track;


async function getStreamUrl(trackId) {
  // 1. Ottieni i dati della traccia
  let response = await fetch(
    `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${clientID}`
  );
  const track = await response.json();
  
  // 2. Filtra per ottenere l'URL del transcoding progressivo (mp3)
  const transcodingUrl = track.media.transcodings.find(
    t => t.format.protocol === 'progressive'
  )?.url;
  
  // 3. Chiama l'URL del transcoding per ottenere l'URL reale
  response = await fetch(`${transcodingUrl}?client_id=${clientID}`);
  const stream = await response.json();
  
  // 4. Questo è l'URL che puoi usare nell'audio player!
  const mp3Url = stream.url;
  
  return mp3Url;
}

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    }
  }
  );

  if(response.ok){
    track = await response.json();
    console.log(track)
  }

  return (
    <div>
      <img src={track.artwork_url} alt={track.title} />
      <h1>{track.title}</h1>
      <p>{track.description}</p>
      <audio src={await getStreamUrl(trackid)} controls />
      <p>Duration: {track.duration}ms</p>
      <p>Plays: {track.playback_count}</p>
      <p>Likes: {track.likes_count}</p>
      {/* Tutte le altre info che ti servono */}
    </div>
  );
}
