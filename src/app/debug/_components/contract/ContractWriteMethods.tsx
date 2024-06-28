import { useMemo } from "react";
import { Abi, AbiFunction } from "abitype";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName, GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
  functionName,
  nameFix = false,
  debug = true,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
  functionName?: string;
  nameFix?: boolean;
  debug?: boolean;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functions = useMemo(
    () =>
      ((deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[])
        .filter(fn => {
          const isWriteableFunction = fn.stateMutability !== "view" && fn.stateMutability !== "pure";
          return isWriteableFunction;
        })
        .map(fn => {
          return {
            fn,
            inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[
              fn.name
            ],
          };
        })
        .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1)),
    [deployedContractData],
  );

  const functionsToDisplay = functionName
    ? useMemo(() => functions.filter(fn => fn.fn.name.toLowerCase() === functionName.toLowerCase()), [functions])
    : functions;

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn, inheritedFrom }, idx) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}}`}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          inheritedFrom={inheritedFrom}
          nameFix={nameFix}
          debug={debug}
        />
      ))}
    </>
  );
};
