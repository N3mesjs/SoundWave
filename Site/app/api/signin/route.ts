import DBConnection from "../../lib/DBConnection";

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();
  const query =
    "SELECT id, username FROM users WHERE username = ? AND password = ?";

  const [rows, fields] = await conn.execute(query, [username, password]);

  if (rows.length > 0) {
    return Response.json(
      {
        message: "Login successful",
        user: rows[0], // Invia l'oggetto utente
      },
      { status: 200 }
    );
  } else {
    return Response.json(
      {
        message: "Invalid username or password",
      },
      { status: 401 }
    );
  }
}
