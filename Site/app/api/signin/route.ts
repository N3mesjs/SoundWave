import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();
  const query = "SELECT * FROM users WHERE username = ?";

  const [rows, fields] = await conn.execute(query, [username]);

  // Check if user exists
  if ((rows as any[]).length > 0) {
    if (await argon2.verify(rows[0].password, password)) {
      const cookieAge = (3600 * 24)*30; 
      const token = sign(
        { id: rows[0].uuid, username: rows[0].username, avatar: rows[0].avatar_url },
        process.env.JWT_SECRET,
        { expiresIn: cookieAge }
      );
      return Response.json(
        {
          message: "Login successful",
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            'Set-Cookie': `session-token=${token}; HttpOnly; Path=/; Max-Age=${cookieAge}; SameSite=Strict` // set cookie header
          },
        }
      );
    } else {
      return Response.json(
        { message: "Invalid Username or Password!" },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } else {
    return Response.json(
      {message: "Invalid Username or Password!"}, 
      {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
      }
    )
  }
}
