import React from "react";
import FunctionContainer from "../../components/FunctionContainer";
import { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "NVM Token",
  description: "NVM | Novem Pro Token Burn UI",
});

const Page: NextPage = () => {
  return (
    <>
      <FunctionContainer functionName="burn" contractName="NVMToken" />
    </>
  );
};

export default Page;
