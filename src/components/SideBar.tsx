import React from "react";
import ExternalVariable from "./ExternalVariable";
import { Address } from "./scaffold-eth";
import { ContractVariables } from "~~/app/debug/_components/contract/ContractVariables";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

interface SideBarProps {
  contractName: ContractName;
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}

const SideBar = ({ deployedContractData, contractName, refreshDisplayVariables }: SideBarProps) => {
  const { targetNetwork } = useTargetNetwork();
  return (
    <div className="flex flex-col min-w-[200px] max-w-[300px] flex-1">
      <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary px-6 lg:px-8 space-y-1 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold">{contractName.toUpperCase() + " Token"}</span>
          <Address address={deployedContractData.address} />
        </div>

        {targetNetwork && (
          <p className="my-0 text-sm">
            <span className="font-bold">Network</span>: <span>{targetNetwork.name}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col bg-base-300 px-6 lg:px-8 py-4 shadow-lg shadow-base-300 flex-1">
        <ContractVariables
          refreshDisplayVariables={refreshDisplayVariables}
          deployedContractData={deployedContractData}
          filters={["name", "symbol", "totalSupply", "paused"]}
          nameFix={true}
        />
        {targetNetwork.name.toLowerCase().includes("testnet") ? null : (
          <>
            <h3 className="mt-2">CoinGecko</h3>
            <hr className="w-1/2 py-1"></hr>
            <ExternalVariable contractName={contractName} />
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
