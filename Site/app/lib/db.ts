import mysql from "mysql2/promise";

export default async function DBConnection() {
  try {
    const conn = await mysql.createConnection({
      host: "db",
      user: "root",
      password: "root",
      database: "db",
    });

    return conn;

  } catch (error) {
    console.log(error);
  }
}
