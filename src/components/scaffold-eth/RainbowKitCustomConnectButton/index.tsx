"use client";

import { useEffect } from "react";
// @refresh reset
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import { useAuth } from "~~/hooks/useAuth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const { address, isConnected } = useAccount();
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { handleLogin, handleLogout, validateSession } = useAuth();

  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (!validate) {
          if (isConnected && address) {
            await handleLogin(address);
          } else {
            setSessionStart(false);
            console.log("index logout excecuted");
            handleLogout();
          }
        } else setSessionStart(true);
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };

    setTimeout(() => login(), 100);
  }, [isConnected, address]);
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;
        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-md rounded-xl" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex flex-col items-center mr-2">
                    <Balance address={account.address as Address} className="min-h-0 h-auto" />
                    <span
                      className={`text-sm font-bold ${
                        chain.name?.toLowerCase() === "bsc" ? "text-amber-400" : "text-red-600"
                      }`}
                    >
                      {chain.name === "BSC"
                        ? "BNB Smart Chain"
                        : chain.name === "Binance Smart Chain Testnet"
                          ? "BSC Testnet"
                          : chain.name}
                    </span>
                  </div>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
