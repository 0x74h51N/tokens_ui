"use client";

import { useMemo, useState } from "react";
import SearchDropdown from "./SearchDropdown";
import { ContractWriteMethods } from "~~/app/debug/_components/contract/ContractWriteMethods";
import { useGlobalState } from "~~/services/store/store";
import getContractSymbol from "~~/utils/getContractSymbol";
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
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const contractFunctions = useGlobalState(state => state.contractFunctions);
  const functions = contractFunctions[deployedContractData.address];
  const [displayedFunctions, setDisplayedFunctions] = useState<string[]>(functionNames);
  const handleSelect = (option: string) => {
    setDisplayedFunctions(prevDisplayedFunctions => [...prevDisplayedFunctions, option]);
    setShowSearch(false);
  };

  const availableFunctions = useMemo(() => {
    return functions ? functions.filter(fn => !displayedFunctions.includes(fn)) : [];
  }, [functions, displayedFunctions]);
  return (
    <>
      <div className="flex w-full -mb-6 z-20">
        {displayedFunctions.map((functionName, i) => (
          <div
            key={functionName + " button " + i}
            className="flex max-w-[10rem] h-[4.7rem] w-[10rem] min-w-1 tooltip tooltip-top tooltip-secondary before:px-2 before:content-[attr(data-tip)] before:-right-3 before:left-auto before:transform-none"
            style={{ zIndex: functionName === activeFunction ? 2 : -1 * i, marginLeft: i === 0 ? 0 : -15 + i }}
            data-tip={getCoolDisplayName(functionName) + " " + getContractSymbol(contractName)}
          >
            <button
              className={`group relative w-full h-full btn btn-secondary rounded-lg hover:border-transparent p-0 ${
                functionName === activeFunction ? "bg-base-300 hover:bg-base-300" : "bg-base-100 hover:bg-secondary"
              }`}
              onClick={() => setActiveFunc(functionName)}
            >
              <h1 className="antialiased font-semibold text-2xl max-md:pt-1 my-1.5 mx-2 text-center w-full self-start pt-1 truncate">
                {getCoolDisplayName(functionName)}
              </h1>
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`btn btn-primary hover:border-transparent w-[5rem] h-[4.7rem] rounded-none font-bold antialiased text-2xl p-0 pl-1 pb-5 -ml-6 -z-50 plus-btn shadow-lg shadow-base-300 ${
            showSearch ? "brightness-75" : "brightness-100"
          }`}
        >
          +
        </button>
      </div>
      {showSearch && availableFunctions && (
        <div onBlur={() => setShowSearch(false)} className="absolute top-0 right-0 z-50">
          <SearchDropdown options={availableFunctions} handleSelect={handleSelect} />{" "}
        </div>
      )}
      {displayedFunctions.map((functionName, i) => (
        <div
          key={functionName + " container " + i}
          className="flex flex-col justify-center items-center w-full h-auto z-20"
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
      ))}
    </>
  );
};

export default FunctionContainer;
