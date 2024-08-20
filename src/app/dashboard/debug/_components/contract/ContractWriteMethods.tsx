import { useEffect, useMemo } from "react";
import { Abi, AbiFunction } from "abitype";
import { useGlobalState } from "~~/services/store/store";
import { Contract, ContractName, GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";
import { WriteOnlyFunctionForm } from "./WriteOnlyFunctionForm";

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
  functionName,
  nameFix = false,
  debug = true,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
  functionName: string;
  nameFix?: boolean;
  debug?: boolean;
}) => {
  const setContractFunctions = useGlobalState(state => state.setContractFunctions);
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
        .sort((a, b) => a.fn.name.localeCompare(b.fn.name)),
    [deployedContractData],
  );

  useEffect(() => {
    const fnArray = functions.map(f => f.fn.name);
    setContractFunctions(deployedContractData.address, fnArray);
  }, [deployedContractData, functions, setContractFunctions]);

  const functionsToDisplay = useMemo(() => {
    return functionName ? functions.filter(fn => fn.fn.name.toLowerCase() === functionName.toLowerCase()) : functions;
  }, [functions, functionName]);

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  return (
    <div className="w-full">
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
    </div>
  );
};
