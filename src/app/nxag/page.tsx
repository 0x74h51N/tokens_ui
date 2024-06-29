import React from "react";
import { NextPage } from "next";
import TokenPage from "~~/components/TokenPage";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NXAG Token",
  description: "NXAG | Novem Silver Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return <TokenPage contractName="NXAGToken" functionNames={["mint", "burn", "transfer"]} />;
};

export default Page;
