import React from "react";
import { NextPage } from "next";
import TokenPage from "~~/components/TokenPage";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NPT Token",
  description: "NPT | Novem Platinum Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return <TokenPage contractName="NPTtoken" functionNames={["mint", "burn", "transfer"]} />;
};

export default Page;
