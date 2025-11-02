"use client";

import React from "react";
import { useState } from "react";

export default function SignIn() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Username: ${userName}, Password: ${password}`);

    const response = await fetch('http://localhost:3050/api/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, password: password }),
    });
    const text = await response.text();
    console.log(text);
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
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            className="input-fields"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button className="submit-button" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
