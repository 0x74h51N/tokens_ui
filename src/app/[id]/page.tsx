import React from "react";
import TokenPage from "./_components/TokenPage";
import { tokenItems } from "~~/contracts/selectedContractNames";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return getMetadata({
    title: params.id.toUpperCase() + " Token",
    description: params.id + " | Novem Token UI",
  });
}

export function generateStaticParams() {
  return tokenItems.map(item => ({
    id: item,
  }));
}

const Page = ({ params }: { params: { id: string } }) => {
  return <TokenPage contractName={params.id as ContractName} />;
};

export default Page;
