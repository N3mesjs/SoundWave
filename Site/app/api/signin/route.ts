import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();
  const query = "SELECT * FROM users WHERE username = ?";

  const [rows, fields] = await conn.execute(query, [username]);

  if (rows.length > 0) {
    if (!(await argon2.verify(rows[0].password, password))) {
      return Response.json(
        { message: "Invalid username or password" },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      const token = sign(
        { ID: rows[0].id, username: rows[0].username },
        process.env.JWT_SECRET
      );
      return Response.json(
        {
          message: "Login successful",
          user: rows[0],
          token: token,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
