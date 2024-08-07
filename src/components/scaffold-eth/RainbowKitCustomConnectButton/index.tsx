"use client";

import Auth0Connection from "~~/components/Auth0Connection";
// @refresh reset
import { Balance } from "../Balance";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const { user, isLoading } = useUser();

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;
        return (
          <>
            {connected && (
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
            )}
            <Auth0Connection
              account={account}
              blockExplorerAddressLink={blockExplorerAddressLink}
              user={user as UserProfile}
              isLoading={isLoading}
              chain={chain}
            />
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
