import React, { Fragment } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";
import { formatPrice } from "~~/utils/formatPrice";
import { ContractName } from "~~/utils/scaffold-eth/contract";

interface DisplayExternalVariablesProps {
  variable: { name: string; value: number };
  fetchData: () => void;
  isFetch: boolean;
  contractName: ContractName;
  currencySymbol: string;
}

/**
 * DisplayExternalVariables Component
 *
 * This component is responsible for displaying a specific external variable, such as
 * token price, circulating supply, or market cap. It provides an interface to refresh
 * the data by invoking the fetchData function, and shows a loading indicator while data
 * is being fetched. Additionally, it applies a visual animation when the variable value
 * changes significantly.
 *
 * @param variable - An object containing the name and value of the variable to be displayed.
 * @param fetchData - A function to fetch the latest data for the variable.
 * @param isFetch - A boolean indicating whether the data is currently being fetched.
 * @param contractName - The name of the token/coin contract, used to determine the display symbol.
 * @param currencySymbol - The symbol of the currency.
 */
const DisplayExternalVariables = ({
  variable,
  fetchData,
  isFetch,
  contractName,
  currencySymbol,
}: DisplayExternalVariablesProps) => {
  // Determine the contract symbol to display based on the contract name.
  // If the contract name ends with "token", remove that suffix for the symbol.
  const suffix = "token";
  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();

  const { showAnimation } = useAnimationConfig(variable.value);
  return (
    <Fragment key={variable.name + " key "}>
      <div className="flex items-center">
        <h3 className="font-medium lg:text-lg text-sm mb-0 break-all">{variable.name}</h3>
        <button className="btn btn-ghost btn-xs" onClick={async () => await fetchData()}>
          {isFetch ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="text-gray-500 font-medium flex flex-col items-start">
        <div
          className={`break-all block transition bg-transparent lg:text-lg text-sm ${
            showAnimation ? "bg-warning rounded-sm animate-pulse-fast" : ""
          }`}
        >
          {variable.value
            ? variable.name.includes("Supply")
              ? formatPrice(variable.value) + " " + contractSymbol
              : currencySymbol + formatPrice(variable.value)
            : 0}
        </div>
      </div>
    </Fragment>
  );
};

export default DisplayExternalVariables;
