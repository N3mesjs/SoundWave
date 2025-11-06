"use client";

import React, { use, useEffect, useState } from "react";
import { decode } from "jsonwebtoken";

export default function SignUp() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName, password: password }),
    });
    const text = await response.json();
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button className="submit-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
