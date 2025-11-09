import mysql from "mysql2/promise";

export default function DBConnection() {
  try {
    const conn = mysql.createPool({
      host: process.env.DATABASE_HOST_NAME,
      user: process.env.DATABASE_USER_NAME,
      password: process.env.DATABASE_USER_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    return conn;

  } catch (error) {
    console.log(error);
  }
}
