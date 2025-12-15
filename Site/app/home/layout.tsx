import "../global.css";
import styles from './home.module.css'

import Header from "../components/header/Header";
import { logout } from '../auth/actions'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "jsonwebtoken";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("session-token");
  let user = null;

    if (cookieToken) {
        const payload = decode(cookieToken.value);
        if (payload && typeof payload === 'object') {
            user = { id: payload.id, username: payload.username, avatar: payload.avatar };
            //console.log(`User authenticated: ${user.id} ${user.username}`);
        }
    } 

    if (!user) {
        redirect('/signin');
    }

  return (
    <>
      <Header userData={user}/>
      <main className={styles.container}>{children}</main>
    </>
  );
}
