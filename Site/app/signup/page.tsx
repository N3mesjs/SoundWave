"use client";

import React, { use, useEffect, useState } from "react";
import { redirect } from 'next/navigation'

export default function SignUp() {
  const [userName, setUserName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [passWord, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName, email: Email, password: passWord }),
    });
    const text = await response.json();
    if(!response.ok){
      setErrorMessage(text.message)
    }else {
      redirect('/home');
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h1 className="title">SoundWave</h1>
          <img src="/logo.png" alt="SoundWave Logo" width={50} height={50} />
        </div>
        <h3>Create a new account</h3>
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
          <label htmlFor="email">Email:</label>
          <br />
          <input
            className="input-fields"
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
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
            {errorMessage !== "" ? <span className="error-message">{errorMessage}</span> : "" }
          <button className="submit-button" type="submit">
            Sign Up
          </button>
          <div className="cardFooter"><span>Already have an account?</span><a href="/signin">Sign in page</a></div>
        </form>
      </div>
    </>
  );
}
