"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { logout } from "../auth/actions";
import useDebounce from "../hooks/useDebounce";

type HeaderProps = {
  userData: {
    id: string;
    username: string;
    avatar: string;
  };
};

export default function Header({ userData }: HeaderProps) {
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toogleuserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setUserMenu((prev) => !prev);
    console.log(userMenu);
  };

  useDebounce<string>("cacca", 400)

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      )
        setUserMenu(false);
    };

    if (userMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userMenu]);

  return (
    <div className="header">
      <Link href="/home">
        <div className="logo">
          <div className="img-logo-container">
            <Image src="/logo.png" alt="logo" fill />
          </div>
          <h1>SoundWave</h1>
        </div>
      </Link>
      <div className="searchArea">
        <input placeholder="What do you want to play? ...." value=""/>
      </div>
      <button className="userArea" onClick={toogleuserMenu}>
        <div className="img-logo-container">
          <Image
            className="avatar"
            src="/default/defaultAvatar.png"
            alt="alt user avatar"
            fill
          />
        </div>
        <h2>{userData.username}</h2>
      </button>
      <div ref={userMenuRef} className={`userMenu ${userMenu ? "show" : ""}`}>
        <ul className="userMenuList">
          <li>
            <Link className="listElement" id="settings" href="/home/settings">
              Settings
            </Link>
          </li>
          <li>
            <button className="listElement" id="logout" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
