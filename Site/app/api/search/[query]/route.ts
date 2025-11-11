import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  // Ora 'params' sarà popolato correttamente perché non ci sono più conflitti.
  const { query } = params;

  // Questo console.log adesso stamperà il valore corretto!
  console.log("Query ricevuta dalla rotta dinamica:", query);

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is missing in the URL path." },
      { status: 400 }
    );
  }

  // Il tuo test
  return NextResponse.json({ message: query });
}


// https://api-v2.soundcloud.com/tracks?q=${process.env.SOUNDCLOUD_CLIENTID}&access=playable&limit=3