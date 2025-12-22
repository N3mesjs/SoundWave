"use client";
import styles from "./Header.module.css";

import Image from "next/image";
import Link from "next/link";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { logout } from "../../auth/actions";
import SearchBar from "../searchBar/SearchBar";

interface HeaderProps {
  userData: {
    id: string;
    username: string;
    avatar: string;
  };
}

export default function Header({ userData }: HeaderProps) {
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const toogleuserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setUserMenu((prev) => !prev);
  };

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

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      )
        setShowSettings(false);
    };

    if (showSettings) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSettings]);

  return (
    <>
      <div className={styles.header}>
        <Link href="/home">
          <div className={styles.logo}>
            <div className={styles.imgLogoContainer}>
              <Image src="/logo.png" alt="logo" fill />
            </div>
            <h1>SoundWave</h1>
          </div>
        </Link>
        <SearchBar />
        <button className={styles.userArea} onClick={toogleuserMenu}>
          <div className={styles.imgLogoContainer}>
            <Image
              className={styles.avatar}
              src="/default/defaultAvatar.png"
              alt="alt user avatar"
              fill
            />
          </div>
          <h2>{userData.username}</h2>
        </button>
        <div
          ref={userMenuRef}
          className={`${styles.userMenu} ${userMenu ? styles.show : ""}`}
        >
          <ul className={styles.userMenuList}>
            <li>
              <button
                className={`${styles.listElement} ${styles.settingsButton}`}
                id="settings"
                onClick={()=> {setShowSettings(true); setUserMenu(false)}}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                className={`${styles.listElement} ${styles.logoutButton}`}
                id="logout"
                onClick={logout}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div ref={settingsRef} className={`${styles.settingsContainer} ${showSettings ? styles.show : ""}`}>

      </div>
    </>
  );
}
