"use client";

import { useReducer } from "react";
import SideBar from "../../../components/SideBar";
import FunctionContainer from "./FunctionContainer/FunctionContainer";
import { TransactionsTable } from "./Transactions/TransactionTable";
import { useDeployedContractInfo, useTargetNetwork } from "~~/hooks/scaffold-eth";
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
  const { targetNetwork } = useTargetNetwork();
  const initialFunctions = ["mint", "burn"];
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName) as {
    data: Contract<ContractName>;
    isLoading: boolean;
  };
  const bscUrl =
    deployedContractData &&
    `https://${targetNetwork.testnet ? "testnet." : ""}bscscan.com/token/${deployedContractData.address}`;
  if (deployedContractLoading) {
    return (
      <div className="mt-[15rem] w-full min-h-full flex flex-col justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return null;
  }
  return (
    <div className="flex md:flex-row flex-col flex-1">
      <SideBar
        contractName={contractName}
        refreshDisplayVariables={refreshDisplayVariables}
        deployedContractData={deployedContractData}
      />
      <div className={`2xl:px-4 lg:px-2 px-0 lg:gap-10 2xl:gap-12 my-0 mt-2 flex-1`}>
        <div className="h-full grid grid-cols-1 xl:grid-cols-7 2xl:grid-cols-9 gap-3 lg:gap-5 2xl:gap-10">
          <div className="col-span-1  xl:col-span-4 2xl:col-span-5 flex flex-col">
            <div className="flex flex-1"></div>
            <div className="w-full flex flex-col relative z-50">
              <FunctionContainer
                functionNames={initialFunctions}
                contractName={contractName}
                deployedContractData={deployedContractData}
                onChange={triggerRefreshDisplayVariables}
              />
            </div>
          </div>
          <div className="col-span-1  xl:col-span-3 2xl:col-span-4 flex flex-col relative  max-h-screen mt-2">
            <h1 className="w-full lg:text-3xl text-xl bg-base-300 p-4 pl-4 antialiased font-semibold rounded-t-xl m-0">
              <span className="relative">
                <a
                  data-tip={bscUrl}
                  className="hover:text-amber-400 tooltip tooltip-info before:truncate"
                  target="_blank"
                  href={bscUrl}
                >
                  {contractName.toUpperCase()}
                </a>
                {" Transactions"}
                <span
                  data-tip="Displaying the last 300 txs for this contract"
                  className="absolute tooltip tooltip-info tooltip-right top-0 -right-2 text-[0.35em] text-xs cursor-help text-center before:max-w-[120px] before:top-4"
                >
                  ?
                </span>
              </span>
            </h1>
            <TransactionsTable deployedContractData={deployedContractData} contractName={contractName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
