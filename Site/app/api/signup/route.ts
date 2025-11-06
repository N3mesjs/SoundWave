import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  let body = await request.json();
  const { username, email, password } = body;

  const conn = DBConnection();
  const findUsername = "SELECT * FROM users WHERE username = ?";
  const saveUser = "INSERT INTO users (id, username, email, password) VALUES(?, ?, ?, ?)";

  const [rows, fields] = await conn.execute(findUsername, [username]);

  if((rows as any[]).length > 0){
    return Response.json(
      {message: "Username already exists!"}, 
      {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  } else {
    const hashedPassword = await argon2.hash(password);
    const newUserId = uuidv4();

    await conn.execute(saveUser, [newUserId, username, email, hashedPassword]);



    const token = sign(
        { id: newUserId, username: username },
        process.env.JWT_SECRET
    );
    return Response.json(
      {message: "User created successfully"}, 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          'Set-Cookie': `session-token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
        }
      }
    );
  }
}
