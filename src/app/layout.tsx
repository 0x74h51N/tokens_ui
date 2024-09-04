import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Head from "next/head";

export const metadata = getMetadata({
  title: "BSC Tokens UI Demo",
  description: "Tokens Functions & Analytics Demo - 0x74h51N",
  imageRelativePath: "/thumbnail.jpg",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <body>
        <ThemeProvider enableSystem>
          <UserProvider>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
