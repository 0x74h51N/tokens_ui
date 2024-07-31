"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useGlobalState } from "~~/services/store/store";
import { useAuth } from "~~/hooks/useAuth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import SignBtn from "./_components/SignBtn";
const Login = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setSessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
    sessionStart: state.sessionStart,
  }));
  const { handleLogin, validateSession } = useAuth();
  const { connectModalOpen, openConnectModal } = useConnectModal();
  const [walletPending, setWalletPending] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (validate) {
          setSessionStart(true);
          router.push("/");
        } else if (isConnected && address) {
          const login = await handleLogin(address);
          if (login?.isLogin) {
            setSessionStart(true);
            router.push("/");
          } else {
            disconnect();
            setPending(false);
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };
    !connectModalOpen && !isConnected && setWalletPending(false);
    login();
  }, [isConnected, address, router, connectModalOpen]);

  return (
    <div className="flex flex-1 items-center justify-center bg-base-300">
      <div className="flex max-md:flex-col md:gap-5 justify-end items-center relative max-xs:w-full bg-base-100 md:rounded-xl md:h-[350px] shadow-md overflow-y-hidden shadow-black">
        <div className="md:h-full sm:h-[200px] h-[150px] md:w-[500px] w-full relative">
          <Image
            fill
            src="/thumbnail.jpg"
            className="h-full w-full object-cover shadow-lg shadow-black"
            alt={"Novem Gold"}
          />
        </div>
        <div className="flex flex-col justify-between max-md:gap-10 max-w-[400px] md:h-full p-7 max-md:px-10">
          <div>
            <h1 className="text-2xl font-bold whitespace-pre-wrap card-title">{`Welcome to\nNovem Gold Blockchain\nDashboard`}</h1>
            <p className="text-md stat-title whitespace-break-spaces m-0">
              Access and manage to NNN, NVM, NXAG and NPT tokens.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <SignBtn
              setPending={setPending}
              pending={pending}
              signText={"Sign in"}
              signedText={"Logged in"}
              onClick={() => {
                window.location.href = "/api/auth/login";
              }}
            ></SignBtn>
            <SignBtn
              setPending={setWalletPending}
              pending={walletPending}
              signText={"Sign in with Wallet"}
              signedText={"Wallet Connected"}
              onClick={() => openConnectModal && openConnectModal()}
              wallet
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
