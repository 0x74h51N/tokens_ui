import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import SearchDropdown from "./SearchDropdown";
import { useGlobalState } from "~~/services/store/store";
import { getCoolDisplayName } from "~~/utils/getCoolDisplayName";
import { createFunctionToken, FunctionTokenResponse, tokenVerify } from "~~/utils/jwt-token";
import { Address } from "viem";

interface FunctionTitlesProps {
  initialFunctions: string[];
  contractAddress: Address;
  activeFunction: string;
  setActiveFunc: Dispatch<SetStateAction<string>>;
}

const FunctionTitles = ({ initialFunctions, contractAddress, activeFunction, setActiveFunc }: FunctionTitlesProps) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const contractFunctions = useGlobalState(state => state.contractFunctions);
  const allFunctions = contractFunctions[contractAddress];
  const [initial, setInitial] = useState(() => true);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedFunctions, setDisplayedFunctions] = useState<string[]>(initialFunctions);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const cookieFunctions = (await tokenVerify(contractAddress, "function_titles")) as FunctionTokenResponse;
      console.log(cookieFunctions);
      if (cookieFunctions && cookieFunctions.data) {
        setDisplayedFunctions(cookieFunctions.data as string[]);
      }
      setLoading(false);
    };
    console.log;
    fetchData();
  }, [contractAddress]);

  useEffect(() => {
    if (!loading && initial) {
      if (displayedFunctions.length === 0) {
        setActiveFunc("null");
      } else {
        setActiveFunc(displayedFunctions[0]);
      }
      setInitial(false);
    }
    if (!loading) {
      createFunctionToken(displayedFunctions, contractAddress, "function_titles");
    }
  }, [displayedFunctions, loading, initial, contractAddress, setActiveFunc]);

  const handleSelect = (option: string) => {
    setDisplayedFunctions(prevDisplayedFunctions => [...prevDisplayedFunctions, option]);
    setShowSearch(false);
    setActiveFunc(option);
  };

  const availableFunctions = useMemo(() => {
    return allFunctions ? allFunctions.filter((fn: string) => !displayedFunctions.includes(fn)) : [];
  }, [allFunctions, displayedFunctions]);

  const closeFunction = (functionName: string) => {
    const index = displayedFunctions.indexOf(functionName);

    setDisplayedFunctions(prevDisplayedFunctions => {
      const updatedFunctions = prevDisplayedFunctions.filter((fn: string) => fn !== functionName);
      if (activeFunction === functionName) {
        setActiveFunc(updatedFunctions[Math.max(0, index - 1)] || "null");
      }
      return updatedFunctions;
    });
  };

  return (
    <>
      <div className="flex w-full -z-10 -mt-2 overflow-hidden relative">
        <div className="flex overflow-x-auto overflow-y-hidden rounded-t-lg pt-20 h-[8rem] max-w-[91%] pr-3 z-10 scrollbar-thumb-custom">
          {loading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            displayedFunctions.map((functionName, i) => (
              <div
                key={functionName + " button " + i}
                className="flex max-w-[10rem] h-[4.2rem] w-[10rem] min-w-[8rem]"
                style={{
                  zIndex: functionName === activeFunction ? 2 : -1 * i,
                  marginLeft: i === 0 ? 0 : -48 + i,
                  filter: "drop-shadow(.25em 0em 4px rgba(0, 0, 0, 0.5))",
                }}
              >
                <div
                  className="absolute tooltip tooltip-top tooltip-secondary -top-1.5 right-7 before:left-6 before:z-50 z-50"
                  data-tip="Close"
                >
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      closeFunction(functionName);
                    }}
                    className="btn min-h-0 !w-4 !h-4 bg-opacity-0 text-opacity-60 hover:text-opacity-90 hover:bg-base-200 hover:bg-opacity-65 border-none shadow-none rounded-sm px-1 !pb-[17px]  pr-1 !m-0 antialiased text-xs font-mono"
                  >
                    x
                  </button>
                </div>

                <div
                  className="w-full h-full tooltip tooltip-top tooltip-secondary before:px-2 before:z-40 before:max-w-24 before:content-[attr(data-tip)] before:right-6 before:left-auto before:transform-none"
                  data-tip={getCoolDisplayName(functionName)}
                >
                  <button
                    className={`w-full h-full btn btn-secondary rounded-none hover:border-transparent plus-btn p-0 ${
                      functionName === activeFunction ? "bg-base-300 " : "bg-base-100 hover:bg-secondary"
                    }`}
                    onClick={() => setActiveFunc(functionName)}
                  >
                    <h1 className="antialiased font-semibold text-2xl pt-0.5 my-1.5 ml-4 mr-5 w-full self-start truncate text-start">
                      {getCoolDisplayName(functionName)}
                    </h1>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div
          className="flex -ml-[90px] mt-20 -z-50 tooltip tooltip-top tooltip-info max-w-[10rem] w-[10rem] min-w-[4rem] h-[4.2rem] -mb-6 p-0 before:px-2 before:content-[attr(data-tip)] before:right-0 before:left-auto before:transform-none"
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
        <div onBlur={() => setShowSearch(false)} className="absolute top-[70px] right-0 z-50">
          <SearchDropdown options={availableFunctions} handleSelect={handleSelect} />{" "}
        </div>
      )}
    </>
  );
};

export default FunctionTitles;
