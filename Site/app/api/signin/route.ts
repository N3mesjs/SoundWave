import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  let body = await request.json();
  const { username, password } = body;

  const conn = DBConnection();
  const query = "SELECT * FROM users WHERE username = ?";

  const [rows, fields] = await conn.execute(query, [username]);

  if ((rows as any[]).length > 0) {
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
      const newUserId = uuidv4();
      const token = sign(
        { id: newUserId, username: rows[0].username },
        process.env.JWT_SECRET
      );
      return Response.json(
        {
          message: "Login successful",
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            'Set-Cookie': `session-token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
          },
        }
      );
    }
  } else {
    return Response.json(
      {message: "Wrong Username or Password!"}, 
      {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
      }
    )
  }
}
