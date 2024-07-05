"use client";

// @refresh reset
import { useEffect } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const handleLogin = async (address: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (response.ok) {
      console.log("Logged in");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;
        if (account?.address && connected) {
          handleLogin(account.address);
        }
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
                        : "Binance Smart Chain Testnet"
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
