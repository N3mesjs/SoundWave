"use client";

import React, { use, useEffect, useState } from "react";
import { redirect } from 'next/navigation'

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
    if(!response.ok){
      setErrorMessage(text.message);
    } else {
      redirect('/home')
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h1 className="title">SoundWave</h1>
          <img src="/logo.png" alt="SoundWave Logo" width={50} height={50} />
        </div>
        <h3>Sign In to Your Account</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            className="input-fields"
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
            className="input-fields"
            type="password"
            placeholder="password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          {errorMessage !== "" ? <div className="error-message">{errorMessage}</div> : "" }
          <button className="submit-button" type="submit">
            Sign In
          </button>
          <div className="cardFooter"><span>Don't have an account?</span><a href="/signup">Sign up page</a></div>
        </form>
      </div>
    </>
  );
}
