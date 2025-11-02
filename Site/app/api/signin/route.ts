import DBConnection from "../../lib/db";

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;
  const conn = await DBConnection();
  await conn.execute("CREATE TABLE IF NOT EXISTS nigga (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))");

  return new Response("Table created"+ " " + username+' '+password);
}