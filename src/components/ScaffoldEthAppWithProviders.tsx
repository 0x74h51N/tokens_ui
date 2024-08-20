"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { useGlobalState } from "~~/services/store/store";
import { useAuth } from "~~/hooks/useAuth";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useInitializeNativeCurrencyPrice();
  const { user, isLoading } = useUser();
  const { setSessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
    sessionStart: state.sessionStart,
  }));
  const { validateSession } = useAuth();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const sessionValid = await validateSession();
      if (sessionValid || user) {
        setSessionStart(true);
      } else {
        setSessionStart(false);
        router.push("/login");
      }
      setIsPending(isLoading);
    };

    validate();
  }, [user, isLoading, setSessionStart]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {isPending ? (
        <div className="flex items-center justify-center min-h-screen bg-base-300">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
