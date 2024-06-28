"use client";

import { useReducer } from "react";
import ExternalVariable from "./ExternalVariable";
import FunctionContainer from "./FunctionContainer";
import { Address } from "./scaffold-eth/Address";
import { ContractVariables } from "~~/app/debug/_components/contract/ContractVariables";
import { useDeployedContractInfo, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

interface TokenPageProps {
  contractName: ContractName;
  functionNames: string[];
}

/**
 * FunctionContainer component
 * @param contractName - Contract name should be same as deployed contract name.
 * @param functionNames - They should be same as deployed contract abi functions.
 * @returns
 */

const TokenPage = ({ contractName, functionNames }: TokenPageProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);

  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName) as {
    data: Contract<ContractName>;
    isLoading: boolean;
  };

  if (deployedContractLoading) {
    return (
      <div className="mt-[15rem] w-full min-h-full flex flex-col justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center w-full ">
      <div className={`grid grid-cols-1 lg:grid-cols-6 px-2 lg:px-10 md:px-8 lg:gap-12 w-full max-w-7xl my-0 mt-20`}>
        <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="col-span-1 flex flex-col">
            <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
              <div className="flex">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">{contractName}</span>
                  <Address address={deployedContractData.address} />
                </div>
              </div>
              {targetNetwork && (
                <p className="my-0 text-sm">
                  <span className="font-bold">Network</span>: <span>{targetNetwork.name}</span>
                </p>
              )}
            </div>
            <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
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
          <div className="col-span-1 lg:col-span-2 flex flex-col mt-14 relative z-50">
            <FunctionContainer
              functionNames={functionNames}
              contractName={contractName}
              deployedContractData={deployedContractData}
              onChange={triggerRefreshDisplayVariables}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
