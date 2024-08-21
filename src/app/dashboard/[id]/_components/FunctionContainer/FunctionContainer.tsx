import { useState } from "react";
import FunctionTitles from "./FunctionTitles";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { ContractWriteMethods } from "~~/app/dashboard/debug/_components/contract/ContractWriteMethods";

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
      >
        <div className="flex flex-col justify-end relative w-full min-w-[500px] max-sm:min-w-[350px] p-7 bg-base-100 rounded-b-xl border border-base-300 min-h-[305px]">
          <ContractWriteMethods
            deployedContractData={deployedContractData}
            functionName={activeFunction}
            onChange={onChange}
            nameFix={true}
            debug={false}
          />
        </div>
      </div>
    </>
  );
};

export default FunctionContainer;
