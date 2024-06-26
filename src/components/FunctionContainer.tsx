"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Abi, AbiFunction, TransactionReceipt } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  ContractInput,
  TxReceipt,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "~~/app/debug/_components/contract";
import { InheritanceTooltip } from "~~/app/debug/_components/contract/InheritanceTooltip";
import { useDeployedContractInfo, useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
import { GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";

/**
 * This component is implemented for 'burn' and 'mint' functions.
 * It displays a form with inputs and a button to call either function on a specified contract.
 * Depending on the functionName prop, it shows different inputs and handles the contract call accordingly.
 */

interface FunctionContainerProps {
  contractName: "NNNToken" | "NVMToken" | "NXAGToken" | "NPTtoken";
  functionName: "mint" | "burn";
}

/**
 * FunctionContainer component
 * @param contractName - Contract name should be same as deployed contract name. Upper and lowercase are included. Should has been added in FunctionContainerProps.
 * @param functionName - Mint or Burn
 * @returns A container for the selected function (mint or burn) with input fields and a submit button.
 */

const FunctionContainer = ({ contractName, functionName }: FunctionContainerProps) => {
  const { chain, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !isConnected || !chain || chain?.id !== targetNetwork.id || chain?.name !== targetNetwork.name;
  const suffix = "token";
  const writeTxn = useTransactor();
  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();

  const { data: result, isPending, writeContractAsync } = useWriteContract();
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();

  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  const abiFunction = useMemo(() => {
    if (!deployedContractData) return null;
    return ((deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[])
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
      .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1))
      .find(fn => fn.fn.name === functionName);
  }, [deployedContractData, functionName]);

  const [form, setForm] = useState<Record<string, any>>(() => abiFunction && getInitialFormState(abiFunction.fn));
  const transformedFunction = useMemo(() => (abiFunction ? transformAbiFunction(abiFunction.fn) : null), [abiFunction]);

  if (!transformedFunction) {
    return null;
  }
  const handleButtonClick = async () => {
    setTriggerValidation(true);
    setTimeout(() => setTriggerValidation(false), 500);
    if (writeContractAsync && abiFunction && deployedContractData) {
      try {
        const makeWriteWithParams = () => {
          return writeContractAsync({
            address: deployedContractData.address,
            functionName: abiFunction.fn.name,
            abi: deployedContractData.abi as Abi,
            args: getParsedContractFunctionArgs(form),
          });
        };
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        console.error(`Error executing ${functionName}: `, e);
      }
    }
  };

  const inputs = transformedFunction.inputs.map((input, inputIndex) => {
    const key = abiFunction
      ? getFunctionInputKey(abiFunction.fn.name, input, inputIndex)
      : getFunctionInputKey(functionName, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setDisplayedTxResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
        triggerValidation={triggerValidation}
      />
    );
  });
  return (
    <>
      <div
        className="flex flex-col mt-24 justify-center items-center w-full h-auto px-8"
        id={contractName + " " + functionName + " id"}
      >
        <div className="flex flex-col relative w-full min-w-[500px] max-sm:min-w-[350px] max-w-[650px] items-center justify-center">
          <div className="flex h-[5.5rem] w-full pr-1 bg-base-300 absolute self-start rounded-[22px] -top-[55px] -left-[1px] shadow-lg shadow-base-300">
            <h1 className="antialiased font-bold text-3xl max-md:text-xl bold m-2 text-center w-full">
              {functionName === "mint" ? "💵 Mint " + contractSymbol : "🔥 Burn " + contractSymbol}
            </h1>
          </div>
          <div className="relative w-full z-10 p-5 divide-y bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300">
            <div className="flex flex-col justify-center items-center gap-6 min-h-[250px]">
              <p className="font-medium my-0 break-words -mb-4">
                <InheritanceTooltip inheritedFrom={abiFunction?.inheritedFrom} />
              </p>
              {inputs}
            </div>
            <div className="w-full flex justify-end border-none mt-4 relative">
              <div className="flex justify-between gap-2">
                <div className="flex-grow basis-0">
                  {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
                </div>
                <div
                  className={`flex ${writeDisabled && "tooltip rounded-md"}`}
                  data-tip={!isConnected ? "Connect your wallet" : `Change network to ${targetNetwork.name}`}
                >
                  <button
                    className="btn btn-secondary btn-sm text-base rounded-xl w-[110px] h-[40px]"
                    disabled={writeDisabled}
                    onClick={handleButtonClick}
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : functionName === "mint" ? (
                      "💵 Mint"
                    ) : (
                      "🔥 Burn"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FunctionContainer;
