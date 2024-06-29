import React from "react";
import { NextPage } from "next";
import TokenPage from "~~/components/TokenPage";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NNN Token",
  description: "NNN | Novem Gold Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return <TokenPage contractName="NNNToken" functionNames={["mint", "burn", "transfer"]} />;
};

export default Page;
