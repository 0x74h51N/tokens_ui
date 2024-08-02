import React, { useEffect, useState } from "react";
import { Session } from "@auth0/nextjs-auth0";
import { useGlobalState } from "~~/services/store/store";
import SignBtn from "~~/app/login/_components/SignBtn";

const AuthLogin = () => {
  const [pending, setPending] = useState(false);
  const { setSessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
  }));
  const [session, setSession] = useState<Session | null>(null);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
    navigator.userAgent,
  );

  const handleAuth = () => {
    const width = 410;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    if (isMobile) {
      window.location.href = "/api/auth/login";
    } else {
      const newAuthWindow = window.open(
        "/api/auth/login",
        "AuthWindow",
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,menubar=no,toolbar=no,location=no`,
      );
      setAuthWindow(newAuthWindow);
    }
  };
  useEffect(() => {
    if (authWindow) {
      const authWindowInterval = setInterval(async () => {
        if (authWindow.closed) {
          clearInterval(authWindowInterval);
          clearTimeout(authWindowTimeout);
          setPending(false);
          setAuthWindow(null);
          return;
        }

        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const session = await response.json();
            setSession(session);
            clearInterval(authWindowInterval);
            clearTimeout(authWindowTimeout);
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }, 1500);

      const authWindowTimeout = setTimeout(() => {
        if (authWindow && !authWindow.closed) {
          authWindow.close();
          setPending(false);
          setAuthWindow(null);
        }
      }, 50000);

      return () => {
        clearInterval(authWindowInterval);
        clearTimeout(authWindowTimeout);
      };
    }
  }, [authWindow]);

  useEffect(() => {
    if (session) {
      authWindow?.close();
      setPending(false);
      setAuthWindow(null);
      setSessionStart(true);
      window.location.reload();
    }
  }, [session, authWindow]);
  return (
    <SignBtn
      setPending={setPending}
      pending={pending}
      signText={"Sign in with Auth0"}
      signedText={"Logged in"}
      onClick={handleAuth}
    />
  );
};

export default AuthLogin;
