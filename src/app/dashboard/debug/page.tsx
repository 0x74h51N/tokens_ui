import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Tokens Debug",
  description: "Token Debug UI",
});

const Debug: NextPage = () => {
  return <DebugContracts />;
};

export default Debug;
