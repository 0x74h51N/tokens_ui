import TokenPage from "./_components/TokenPage";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const tokenItems = JSON.parse(process.env.NEXT_PUBLIC_SELECTED_TOKEN_ID || "[]");
export async function generateMetadata({ params }: { params: { id: string } }) {
  return getMetadata({
    title: params.id.toUpperCase() + " Token",
    description: params.id + " | Novem Token UI",
  });
}

export function generateStaticParams() {
  return tokenItems.map((item: string) => ({
    id: item,
  }));
}

const Page = ({ params }: { params: { id: string } }) => {
  return <TokenPage contractName={params.id as ContractName} />;
};

export default Page;
