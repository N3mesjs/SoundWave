export default async function Page(){

    return(
        <>
            <audio src={'http://localhost:3000/api/song-stream'} controls />
        </>
    )
}