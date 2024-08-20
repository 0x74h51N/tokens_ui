import { UserProfile } from "@auth0/nextjs-auth0/client";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButtonRendererProps } from "@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButtonRenderer";
import { Address, getAddress } from "viem";
import { useAuth } from "~~/hooks/useAuth";
import { useGlobalState } from "~~/services/store/store";
import { BlockieAvatar, isENS } from "./scaffold-eth";
import { AddressInfoDropdown } from "./scaffold-eth/RainbowKitCustomConnectButton/AddressInfoDropdown";
import { AddressQRCodeModal } from "./scaffold-eth/RainbowKitCustomConnectButton/AddressQRCodeModal";

interface Auth0ConnectionProps {
  user: UserProfile | undefined;
  isLoading: boolean;
  account: Pick<
    ConnectButtonRendererProps["children"] extends (renderProps: infer P) => ReactNode ? P : never,
    "account"
  >["account"];
  blockExplorerAddressLink: string | undefined;
  chain: Pick<
    ConnectButtonRendererProps["children"] extends (renderProps: infer P) => ReactNode ? P : never,
    "chain"
  >["chain"];
}
const Auth0Connection = ({ user, isLoading, account, blockExplorerAddressLink, chain }: Auth0ConnectionProps) => {
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const checkSumAddress = account ? getAddress(account.address) : null;
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
    setSelectingNetwork(false);
  };
  useOutsideClick(dropdownRef, closeDropdown);
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { handleLogin, validateSession, handleLogout } = useAuth();
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (isConnected && address && !validate) {
          const login = await handleLogin(address);
          if (login?.isLogin === false) {
            disconnect();
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };
    login();
  }, [isConnected, address]);

  const handleLogoutBtn = async () => {
    if (user) {
      await router.push("/api/auth/logout");
      !account && setSessionStart(false);
    }
    if (account) {
      await handleLogout();
      await disconnect();
      router.push("/login");
    }
  };

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary
          onClick={() => selectingNetwork && setSelectingNetwork(false)}
          tabIndex={0}
          className="btn btn-primary btn-md px-2 shadow-md dropdown-toggle gap-0 rounded-xl min-w-40"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : user ? (
            <div className="flex items-center">
              {imageError ? (
                <></>
              ) : (
                <img
                  width={35}
                  height={35}
                  src={(user.picture as string) || ""}
                  alt={user.nickname || "User Avatar"}
                  className="rounded-md"
                  onError={() => setImageError(true)}
                />
              )}
              <span className="ml-3 mr-2">{user.nickname}</span>
              <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
            </div>
          ) : (
            account &&
            checkSumAddress && (
              <>
                <BlockieAvatar address={checkSumAddress} size={30} ensImage={account.ensAvatar} />
                <span className="ml-2 mr-1">
                  {isENS(account.displayName)
                    ? account.displayName
                    : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
                </span>
                <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
              </>
            )
          )}
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[2] p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1 min-w-40"
        >
          {user && (
            <>
              <li className="menu-item px-3 !rounded-xl flex gap-3 mt-1 -mb-4">Welcome</li>
              <li className="menu-item btn-sm !rounded-xl flex gap-3 py-3">{user.name}</li>
              {user.org_id && <li className="menu-item btn-sm !rounded-xl flex gap-3 py-3">{user.org_id}</li>}
              <li></li>
            </>
          )}
          {!isConnected ? (
            <li>
              <button className="menu-itembtn-sm !rounded-xl flex gap-3 py-2" onClick={openConnectModal} type="button">
                Connect Wallet
              </button>
            </li>
          ) : (
            account && (
              <AddressInfoDropdown
                address={account.address as Address}
                displayName={account.displayName}
                blockExplorerAddressLink={blockExplorerAddressLink}
                selectingNetwork={selectingNetwork}
                setSelectingNetwork={setSelectingNetwork}
                chain={chain}
              />
            )
          )}
          <li>
            <button
              className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
              type="button"
              onClick={() => {
                handleLogoutBtn();
              }}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
      {account && <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />}
    </>
  );
};

export default Auth0Connection;
