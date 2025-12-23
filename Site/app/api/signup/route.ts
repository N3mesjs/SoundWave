import DBConnection from "../../lib/DBConnection";
import { sign, verify } from "jsonwebtoken";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from 'uuid';

/**
 * Gestore della rotta API POST per la registrazione (Signup) di un nuovo utente.
 * * Il flusso gestisce:
 * 1. Estrazione dei dati (username, email, password) dal body.
 * 2. Controllo della disponibilità dello username nel DB.
 * 3. Hashing sicuro della password con Argon2.
 * 4. Generazione di un UUID unico per il nuovo utente.
 * 5. Salvataggio nel DB e creazione immediata della sessione utente (JWT via cookie).
 *
 * @param {Request} request L'oggetto Request contenente i dati di registrazione nel body JSON.
 * @returns {Response} Una risposta JSON con lo stato della creazione (successo o fallimento).
 */

export async function POST(request: Request) {
  try{
    let body = await request.json();
    const { username, email, password } = body;

    const conn = DBConnection();
    const findUsername = "SELECT * FROM users WHERE username = ?";
    const saveUser = "INSERT INTO users (uuid, username, email, password) VALUES(?, ?, ?, ?)";

    const [rows] = await conn.execute(findUsername, [username]);
    const defaultAvatar = '/default/defaultAvatar.png'

    // Check if username already exists
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
    // If username is available, create new user, hash password, assign uuid and create JWT token
    } else {
      const hashedPassword = await argon2.hash(password);
      const newUserId = uuidv4();
      const cookieAge = (3600 * 24)*30; 
      await conn.execute(saveUser, [newUserId, username, email, hashedPassword]);

      const token = sign(
        { id: newUserId, username: username, avatar: defaultAvatar},
        process.env.JWT_SECRET,
        {expiresIn: cookieAge}
      );
      return Response.json(
        {message: "User created successfully"}, 
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            'Set-Cookie': `session-token=${token}; HttpOnly; Path=/; Max-Age=${cookieAge}; SameSite=Strict`
          }
        }
      );
    }
  } catch (error) {
    console.error("Signup API Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}
