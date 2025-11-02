import DBConnection from "../../lib/DBConnection";

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();

  await conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])

  return new Response(JSON.stringify({ message: "User signed in successfully" }), { status: 200 });
}