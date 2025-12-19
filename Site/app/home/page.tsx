export default async function Page(){

    return(
        <>
            <h1>Home Page</h1>
            <audio src ="/api/song-stream" controls />
            <video src ="/api/song-stream" controls/>
        </>
    )
}