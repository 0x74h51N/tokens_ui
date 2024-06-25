import React from "react";
import { NextPage } from "next";
import FunctionContainer from "~~/components/FunctionContainer";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NNN Token",
  description: "NNN | Novem Gold Token Minting & Burning UI",
});

const Page: NextPage = () => {
  return (
    <>
      <FunctionContainer functionName="mint" contractName="NNNToken" />
      <FunctionContainer functionName="burn" contractName="NNNToken" />
    </>
  );
};

export default Page;
