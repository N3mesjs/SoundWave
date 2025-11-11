"use client";

import React, { use, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import styles from "../sign.module.css";

export default function SignIn() {
  const [userName, setUserName] = useState<string>("");
  const [passWord, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const response = await fetch("api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName, password: passWord }),
    });
    const text = await response.json();
    if (!response.ok) {
      setErrorMessage(text.message);
    } else {
      redirect("/home");
    }
  };
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>SoundWave</h1>
          <img src="/logo.png" alt="SoundWave Logo" width={50} height={50} />
        </div>
        <h3>Sign In to Your Account</h3>
        <hr />
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            className={styles.inputFields}
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            className={styles.inputFields}
            type="password"
            placeholder="password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          {errorMessage !== "" ? (
            <div className={styles.errorMessage}>{errorMessage}</div>
          ) : (
            ""
          )}
          <button className={styles.submitButton} type="submit">
            Sign In
          </button>
          <div className={styles.cardFooter}>
            <span>Don't have an account?</span>
            <a href="/signup">Sign up page</a>
          </div>
        </form>
      </div>
    </>
  );
}
