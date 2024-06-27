import React from "react";
import { NextPage } from "next";
import TokenPage from "~~/components/TokenPage";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NVM Token",
  description: "NVM | Novem Pro Token Burn UI",
});

const Page: NextPage = () => {
  return <TokenPage contractName="NVMToken" functionNames={["burn", "transfer"]} />;
};

export default Page;
