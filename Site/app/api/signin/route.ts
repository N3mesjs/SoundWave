import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";

/**
 * Gestore della rotta API POST per l'autenticazione (Login) dell'utente.
 * * Questa rotta gestisce il flusso di autenticazione:
 * 1. Connessione al DB.
 * 2. Ricerca dell'utente tramite username.
 * 3. Verifica della password tramite Argon2.
 * 4. Generazione di un JWT contenente i dati essenziali dell'utente.
 * 5. Impostazione del JWT in un cookie HttpOnly per la gestione della sessione.
 *
 * @param {Request} request L'oggetto Request contenente username e password nel body JSON.
 * @returns {Response} Una risposta JSON con lo stato del login (successo o fallimento).
 */

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
