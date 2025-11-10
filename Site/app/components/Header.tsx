"use client";

import Image from "next/image";
import Link from 'next/link'

import { useState, useRef, useEffect, MouseEvent } from "react";
import { logout } from "../auth/actions"

type HeaderProps = {
  userData: {
    id: string;
    username: string;
    avatar: string;
  };
};

export default function Header({ userData }: HeaderProps) {
  const [userBar, setUserBar] = useState<boolean>(false);
  const userBarRef = useRef<HTMLDivElement>(null);

  const toogleUserBar = (event: React.MouseEvent) => {
    event.stopPropagation();
    setUserBar((prev) => !prev);
    console.log(userBar);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userBarRef.current &&
        !userBarRef.current.contains(event.target as Node)
      )
        setUserBar(false);
    };

    if (userBar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="logo">
        <div className="img-logo-container">
          <Image src="/logo.png" alt="logo" fill />
        </div>
        <h1>SoundWave</h1>
      </div>
      <div className="userArea" onClick={toogleUserBar}>
        <div className="img-logo-container">
          <Image
            className="avatar"
            src="/default/defaultAvatar.png"
            alt="alt user avatar"
            fill
          />
        </div>
        <h3>{userData.username}</h3>
        <div
          ref={userBarRef}
          className={`userUtils ${userBar ? "hidden" : ""}`}>
          <ul className="userUtilsList">
            <li><Link className="listElement" id="settings" href="/home/setting">Settings</Link></li>
            <li className="listElement" id="logout" onClick={logout}>Log Out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
