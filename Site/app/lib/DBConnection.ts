import mysql from "mysql2/promise";

export default function DBConnection() {
  try {
    const conn = mysql.createPool({
      host: "db",
      user: "root",
      password: "root",
      database: "SoundWaveDB",
    });

    return conn;

  } catch (error) {
    console.log(error);
  }
}
