import React from "react";
import { NextPage } from "next";
import FunctionContainer from "~~/components/FunctionContainer";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NPT Token",
  description: "NPT | Novem Platinum Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return (
    <>
      <FunctionContainer functionName="mint" contractName="NPTtoken" />
      <FunctionContainer functionName="burn" contractName="NPTtoken" />
    </>
  );
};

export default Page;
