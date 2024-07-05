"use client";

// @refresh reset
import { useReducer, useState } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const networkColor = useNetworkColor();
  const [readActive, setReadActive] = useState(true);

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
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
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="xl:col-span-5 lg:col-span-6 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-t-xl px-6 lg:px-8 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={deployedContractData.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{targetNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="bg-base-300 rounded-b-xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <button
                onClick={() => setReadActive(true)}
                className={`btn-sm font-light hover:border-transparent ${
                  readActive
                    ? "bg-base-300 hover:bg-base-300 no-animation -z-10"
                    : "bg-base-100 hover:bg-secondary -z-20"
                } h-[5rem] w-[5.5rem] absolute self-start rounded-xl -top-[38px] -left-[1px]  py-[0.65rem] shadow-lg shadow-base-300`}
              >
                <div className="flex h-[5rem] items-start justify-center space-x-2">
                  <p className="my-0 text-sm">Read</p>
                </div>
              </button>
              <button
                onClick={() => setReadActive(false)}
                className={`btn-sm font-light hover:border-transparent ${
                  readActive
                    ? "bg-base-100 hover:bg-secondary -z-20"
                    : "bg-base-300 hover:bg-base-300 no-animation -z-10"
                } h-[5rem] w-[5.5rem] absolute self-start rounded-xl -top-[38px] left-[80px] py-[0.65rem] shadow-lg shadow-base-300`}
              >
                <div className="flex h-[5rem] items-start justify-center space-x-2">
                  <p className="my-0 text-sm">Write</p>
                </div>
              </button>
              <div className="p-5 divide-y divide-base-300">
                {readActive ? (
                  <ContractReadMethods deployedContractData={deployedContractData} />
                ) : (
                  <ContractWriteMethods
                    deployedContractData={deployedContractData}
                    onChange={triggerRefreshDisplayVariables}
                    functionName={""}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
