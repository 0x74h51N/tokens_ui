"use client";

import { useEffect, useReducer } from "react";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import SideBar from "~~/components/SideBar";
import { useGlobalState } from "~~/services/store/store";
import TokenUI from "./TokenUi";

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
  const sidebarOpenState = useGlobalState(state => state.sidebarOpen[contractName]);
  const setSidebarOpen = useGlobalState(state => state.setSidebarOpen);
  const isSidebarOpen = sidebarOpenState !== undefined ? sidebarOpenState : true;

  const toggleSidebar = () => {
    setSidebarOpen(contractName, !isSidebarOpen);
  };

  useEffect(() => {
    if (sidebarOpenState === undefined) {
      setSidebarOpen(contractName, true);
    }
  }, [contractName, sidebarOpenState, setSidebarOpen]);

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);

  if (deployedContractLoading || !deployedContractData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="flex md:flex-row flex-col min-h-[95vh]">
      <div
        className={`transition-transform duration-500 z-50 ${isSidebarOpen ? "md:translate-x-0 translate-y-0" : "md:-translate-x-full max-md:-translate-y-full"} ease-in-out relative`}
      >
        <button
          className={`absolute btn btn-secondary md:top-12 text-start p-2 md:bg-base-300 bg-base-100 w-10 h-10 transition-all duration-500 ease-in-out before:max-md:hidden tooltip md:tooltip-secondary before:z-50 tooltip-right
            ${isSidebarOpen ? "md:right-0 max-md:right-10 max-md:bottom-10 md:rounded-r-full max-md:rounded-b-full pt-2" : "md:-right-10 max-md:-bottom-10 max-md:right-10 md:rounded-l-full max-md:rounded-t-full md:pt-1 max-md:pl-3 pt-3"}`}
          onClick={toggleSidebar}
          data-tip={isSidebarOpen ? "Close" : contractName.toUpperCase() + " Info"}
        >
          <div
            className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "md:rotate-180 max-md:-rotate-90" : "max-md:rotate-90"}`}
          >
            {"➥"}
          </div>
        </button>
        <SideBar
          contractName={contractName}
          refreshDisplayVariables={refreshDisplayVariables}
          deployedContractData={deployedContractData}
        />
      </div>
      <div
        className={`flex w-full transition-all duration-500 ease-in-out ${isSidebarOpen ? "" : "lg:-ml-[260px] md:-ml-[195px] max-md:-mt-[470px]"}`}
      >
        <TokenUI
          deployedContractData={deployedContractData}
          contractName={contractName}
          trigger={triggerRefreshDisplayVariables}
        />
      </div>
    </div>
  );
};

export default TokenPage;
