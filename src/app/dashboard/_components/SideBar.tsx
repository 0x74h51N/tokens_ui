import React from "react";
import ExternalVariable from "./ExternalVariable";
import { Address } from "../../../components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { ContractVariables } from "~~/app/dashboard/debug/_components/contract/ContractVariables";

interface SideBarProps {
  contractName: ContractName;
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}

/**
 * SideBar Component
 *
 * This component displays key information about a deployed smart contract,
 * such as its address and associated network. It also shows specific contract
 * variables and, if applicable, external data from CoinGecko.
 *
 * @param deployedContractData - The data related to the deployed contract abi.
 * @param contractName - The name of the contract being displayed.
 * @param refreshDisplayVariables - A boolean to trigger a refresh of the displayed contract variables.
 *
 * @returns A sidebar UI component that provides insights and details about the smart contract.
 */
const SideBar = ({ deployedContractData, contractName, refreshDisplayVariables }: SideBarProps) => {
  const { targetNetwork } = useTargetNetwork();
  return (
    <div className="flex flex-col md:w-[200px] lg:w-[260px] max-md:mb-10 h-full">
      <div className="bg-base-100 border-base-300 border shadow-md shadow-base-300 px-4 lg:px-7 space-y-1 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold lg:text-lg text-sm">{contractName.toUpperCase() + " Token"}</span>
          <Address address={deployedContractData.address} />
        </div>

        {targetNetwork && (
          <p className="my-0 lg:text-sm text-xs">
            <span className="font-bold">Network</span>: <span>{targetNetwork.name}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col bg-base-300 px-4 lg:px-7 py-4 shadow-lg shadow-base-300 flex-1">
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
