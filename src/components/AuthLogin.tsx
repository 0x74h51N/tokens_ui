import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Session } from "@auth0/nextjs-auth0";
import { useGlobalState } from "~~/services/store/store";
import SignBtn from "~~/app/login/_components/SignBtn";

const AuthLogin = () => {
  const { setSessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
  }));
  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);
  const handleAuth = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const authWindowInterval = setInterval(async () => {
      try {
        if (isModalOpen) {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const session = await response.json();
            setSession(session);
            clearInterval(authWindowInterval);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }, 1500);

    const authWindowTimeout = setTimeout(() => {
      setIsModalOpen(false);
    }, 20000);

    return () => {
      clearInterval(authWindowInterval);
      clearTimeout(authWindowTimeout);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (session) {
      setIsModalOpen(false);

      setSessionStart(true);
      window.location.reload();
    }
  }, [session]);

  return (
    <>
      <SignBtn signText={"Sign in with Auth0"} signedText={"Logged in"} onClick={handleAuth} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="p-10 bg-base-300 w-[400px] h-[450px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-base-300  bg-opacity-75"
        contentLabel="Auth0 Login"
      >
        <iframe
          src="/api/auth/login"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Auth0 Login"
        ></iframe>
      </Modal>
    </>
  );
};

export default AuthLogin;
