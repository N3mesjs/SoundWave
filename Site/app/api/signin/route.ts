import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";

export async function POST(request: Request) {

  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();
  const query =
    "SELECT id, username FROM users WHERE username = ? AND password = ?";

  const [rows, fields] = await conn.execute(query, [username, password]);

  if (rows.length > 0) {
    const token = sign(rows[0], process.env.JWT_SECRET)
    console.log("Generated Token:", token);
    return Response.json(
      {
        message: "Login successful",
        user: rows[0],
        token: token
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
