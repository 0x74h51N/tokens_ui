"use client";

import { useState } from "react";
import FunctionTitles from "./FunctionTitles";
import { ContractWriteMethods } from "~~/app/debug/_components/contract/ContractWriteMethods";
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
  const [activeFunction, setActiveFunc] = useState<string>(() => "null");

  return (
    <>
      <FunctionTitles
        initialFunctions={functionNames}
        contractAddress={deployedContractData.address}
        activeFunction={activeFunction}
        setActiveFunc={setActiveFunc}
      />
      <div
        className="flex flex-col justify-center items-center w-full h-auto z-0"
        id={contractName + " " + activeFunction + " id"}
        style={{ display: activeFunction !== activeFunction ? "none" : "block" }}
      >
        <div className="flex flex-col relative w-full min-w-[500px] max-sm:min-w-[350px] items-center justify-center">
          <div className="flex flex-col justify-end w-full z-10 p-7 divide-y bg-base-100 rounded-b-xl shadow-lg shadow-secondary border border-base-300 min-h-[305px]">
            <ContractWriteMethods
              deployedContractData={deployedContractData}
              functionName={activeFunction}
              onChange={onChange}
              nameFix={true}
              debug={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FunctionContainer;
