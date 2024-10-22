"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { ContractUI } from "./contract";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];
const tokenItems = JSON.parse(process.env.NEXT_PUBLIC_SELECTED_TOKEN_ID || "[]");
const filteredContracts = tokenItems.filter((item: string): item is ContractName =>
  contractNames.includes(item as ContractName),
);
export function DebugContracts() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    filteredContracts[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!filteredContracts.includes(selectedContract)) {
      setSelectedContract(filteredContracts[0]);
    }
  }, [selectedContract, setSelectedContract]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {filteredContracts.length === 0 ? (
        <p className="text-3xl mt-14">No contracts found!</p>
      ) : (
        <>
          {filteredContracts.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {filteredContracts.map((contractName: ContractName) => (
                <button
                  className={`btn btn-secondary btn-md rounded-xl font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {contractName.toUpperCase() + " Token"}
                  {contractsData[contractName].external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External contract">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {filteredContracts.map((contractName: ContractName) => (
            <ContractUI
              key={contractName}
              contractName={contractName}
              className={contractName === selectedContract ? "" : "hidden"}
            />
          ))}
        </>
      )}
    </div>
  );
}
