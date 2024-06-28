"use client";

import { Fragment, useState } from "react";
import { ContractWriteMethods } from "~~/app/debug/_components/contract/ContractWriteMethods";
import { getCoolDisplayName } from "~~/utils/getCoolDisplayName";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

/**
 * This component is implemented for specific functions' ui.
 * It displays a form with inputs and a button to call either function on a specified contract.
 * Depending on the functionName prop, it shows different inputs and handles the contract call accordingly.
 */

interface FunctionContainerProps {
  contractName: ContractName;
  functionNames: string[];
  deployedContractData: Contract<ContractName>;
  onChange: () => void;
}

/**
 * FunctionContainer component
 * @param contractName - Contract name should be same as deployed contract name.
 * @param functionName - It should be same as deployed contract abi functions.
 * @returns A container for the selected functions with input fields and a submit button.
 */

const FunctionContainer = ({ contractName, functionNames, deployedContractData, onChange }: FunctionContainerProps) => {
  const [activeFunction, setActiveFunc] = useState<string>(functionNames[0]);

  return (
    <>
      {functionNames.map((functionName, i) => (
        <Fragment key={functionName + " fragment " + i}>
          <button
            className={`flex h-[5.7rem] w-[10rem] btn btn-secondary btn-md rounded-xl font-light hover:border-transparent p-0 absolute -top-12 ${
              functionName === activeFunction
                ? "bg-base-300 hover:bg-base-300 no-animation shadow-xl shadow-base-300"
                : "bg-base-100 hover:bg-secondary"
            }`}
            style={{ left: i * 150, zIndex: functionName === activeFunction ? 10 : -1 * i }}
            onClick={() => setActiveFunc(functionName)}
          >
            <h1 className="antialiased font-bold text-2xl max-md:pt-1 bold m-1 text-center w-full self-start pt-2">
              {getCoolDisplayName(functionName)}
            </h1>
          </button>
          <div
            className="flex flex-col justify-center items-center w-full h-auto"
            id={contractName + " " + functionName + " id"}
            style={{ display: functionName !== activeFunction ? "none" : "block" }}
          >
            <div className="flex flex-col relative w-full min-w-[500px] max-sm:min-w-[350px] max-w-[650px] items-center justify-center">
              <div className="flex flex-col justify-end w-full z-10 p-7 divide-y bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 min-h-[305px]">
                <ContractWriteMethods
                  deployedContractData={deployedContractData}
                  functionName={functionName}
                  onChange={onChange}
                  nameFix={true}
                  debug={false}
                />
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </>
  );
};

export default FunctionContainer;
