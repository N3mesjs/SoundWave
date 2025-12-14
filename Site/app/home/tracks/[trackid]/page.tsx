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
      <audio src="" controls />
      <p>Duration: {track.duration}ms</p>
      <p>Plays: {track.playback_count}</p>
      <p>Likes: {track.likes_count}</p>
      {/* Tutte le altre info che ti servono */}
    </div>
  );
}
