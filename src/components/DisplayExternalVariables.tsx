import React, { Fragment } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";
import { formatPrice } from "~~/utils/formatPrice";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const DisplayExternalVariables = ({
  variable,
  fetchData,
  isFetch,
  contractName,
}: {
  variable: { name: string; value: number };
  fetchData: () => void;
  isFetch: boolean;
  contractName: ContractName;
}) => {
  const suffix = "token";

  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();

  const { showAnimation } = useAnimationConfig(variable.value);
  return (
    <Fragment key={variable.name + " key "}>
      <div className="flex items-center">
        <h3 className="font-medium text-lg mb-0 break-all">{variable.name}</h3>
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
          className={`break-all block transition bg-transparent ${
            showAnimation ? "bg-warning rounded-sm animate-pulse-fast" : ""
          }`}
        >
          {variable.value
            ? variable.name.includes("Supply")
              ? formatPrice(variable.value) + " " + contractSymbol
              : "$" + formatPrice(variable.value)
            : 0}
        </div>
      </div>
    </Fragment>
  );
};

export default DisplayExternalVariables;
