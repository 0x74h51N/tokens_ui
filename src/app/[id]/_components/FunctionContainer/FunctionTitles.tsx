import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import SearchDropdown from "../SearchDropdown";
import { useGlobalState } from "~~/services/store/store";
import getContractSymbol from "~~/utils/getContractSymbol";
import { getCoolDisplayName } from "~~/utils/getCoolDisplayName";

interface FunctionTitlesProps {
  initialFunctions: string[];
  contractAddress: string;
  activeFunction: string;
  setActiveFunc: Dispatch<SetStateAction<string>>;
  contractName: string;
}

const FunctionTitles = ({
  initialFunctions,
  contractAddress,
  activeFunction,
  setActiveFunc,
  contractName,
}: FunctionTitlesProps) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const contractFunctions = useGlobalState(state => state.contractFunctions);
  const functions = contractFunctions[contractAddress];
  const [displayedFunctions, setDisplayedFunctions] = useState<string[]>(initialFunctions);
  const handleSelect = (option: string) => {
    setDisplayedFunctions(prevDisplayedFunctions => [...prevDisplayedFunctions, option]);
    setShowSearch(false);
  };

  const availableFunctions = useMemo(() => {
    return functions ? functions.filter((fn: string) => !displayedFunctions.includes(fn)) : [];
  }, [functions, displayedFunctions]);

  return (
    <>
      <div className="flex w-full -z-10 -mt-20">
        <div className="flex overflow-x-auto overflow-y-hidden rounded-t-lg pt-20 h-[8rem] max-w-[91%] pr-3 z-10 scrollbar-thumb-custom">
          {displayedFunctions.map((functionName, i) => (
            <div
              key={functionName + " button " + i}
              className="flex max-w-[10rem] h-[4.2rem] w-[10rem] min-w-[8rem] tooltip tooltip-top tooltip-secondary before:px-2 before:z-40 before:content-[attr(data-tip)] before:-right-3 before:left-auto before:transform-none"
              style={{
                zIndex: functionName === activeFunction ? 2 : -1 * i,
                marginLeft: i === 0 ? 0 : -48 + i,
                filter: "drop-shadow(.25em 0em 4px rgba(0, 0, 0, 0.5))",
              }}
              data-tip={getCoolDisplayName(functionName) + " " + getContractSymbol(contractName)}
            >
              <button
                className={`w-full h-full btn btn-secondary rounded-none hover:border-transparent plus-btn p-0 ${
                  functionName === activeFunction ? "bg-base-300 " : "bg-base-100 hover:bg-secondary"
                }`}
                onClick={() => setActiveFunc(functionName)}
              >
                <h1 className="antialiased font-semibold text-2xl pt-1 my-1.5 mx-4 w-full self-start truncate text-start">
                  {getCoolDisplayName(functionName)}
                </h1>
              </button>
            </div>
          ))}
        </div>
        <div
          className="flex -ml-[90px] mt-20 -z-50 tooltip tooltip-top tooltip-info max-w-[10rem] w-[10rem] min-w-[4rem] h-[4.2rem] -mb-6 p-0 before:px-2 before:content-[attr(data-tip)] before:right-5 before:left-auto before:transform-none"
          style={{
            filter: "drop-shadow(.25em 0em 4px rgba(0, 0, 0, 0.5))",
          }}
          data-tip={"Add function"}
        >
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`btn btn-primary hover:border-transparent w-full h-full rounded-none font-bold antialiased text-2xl p-0 pl-12 pb-5 plus-btn shadow-lg shadow-base-300 ${
              showSearch ? "brightness-75" : "brightness-100"
            }`}
          >
            +
          </button>
        </div>
      </div>
      {showSearch && availableFunctions && (
        <div onBlur={() => setShowSearch(false)} className="absolute top-0 right-0 z-50">
          <SearchDropdown options={availableFunctions} handleSelect={handleSelect} />{" "}
        </div>
      )}
    </>
  );
};

export default FunctionTitles;
