import { DisplayVariable } from "./DisplayVariable";
import { Abi, AbiFunction } from "abitype";
import { Contract, ContractName, GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";

export const ContractVariables = ({
  refreshDisplayVariables,
  deployedContractData,
  filters,
  nameFix = false,
}: {
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
  filters?: string[];
  nameFix?: boolean;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functions = ((deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[])
    .filter(fn => {
      const isQueryableWithNoParams =
        (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;
      return isQueryableWithNoParams;
    })
    .map(fn => {
      return {
        fn,
        inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
      };
    });

  const functionsToDisplay =
    filters && filters.length > 0 ? functions.filter(fn => filters.includes(fn.fn.name)) : functions;

  if (!functionsToDisplay.length) {
    return <>No contract variables</>;
  }
  return (
    <>
      {functionsToDisplay.map(({ fn, inheritedFrom }) => (
        <DisplayVariable
          abi={deployedContractData.abi as Abi}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          key={fn.name}
          refreshDisplayVariables={refreshDisplayVariables}
          inheritedFrom={inheritedFrom}
          nameFix={nameFix}
        />
      ))}
    </>
  );
};
