import React from "react";
import { NextPage } from "next";
import FunctionContainer from "~~/components/FunctionContainer";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NXAG Token",
  description: "NXAG | Novem Silver Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return (
    <>
      <FunctionContainer functionName="mint" contractName="NXAGToken" />
      <FunctionContainer functionName="burn" contractName="NXAGToken" />
    </>
  );
};

export default Page;
