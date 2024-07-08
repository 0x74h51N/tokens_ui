"use client";

import { useReducer } from "react";
import SideBar from "../../../components/SideBar";
import TokenUI from "./TokensUi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

interface TokenPageProps {
  contractName: ContractName;
}

/**
 * FunctionContainer component
 * @param contractName - Contract name should be same as deployed contract name.
 * @returns
 */

const TokenPage = ({ contractName }: TokenPageProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName) as {
    data: Contract<ContractName>;
    isLoading: boolean;
  };

  if (deployedContractLoading || !deployedContractData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="flex md:flex-row flex-col flex-1">
      <SideBar
        contractName={contractName}
        refreshDisplayVariables={refreshDisplayVariables}
        deployedContractData={deployedContractData}
      />
      <TokenUI
        deployedContractData={deployedContractData}
        contractName={contractName}
        trigger={triggerRefreshDisplayVariables}
      />
    </div>
  );
};

export default TokenPage;
