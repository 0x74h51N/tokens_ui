"use client";

import { useEffect, useMemo, useState } from "react";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { Abi, AbiFunction } from "abitype";
import { Address, TransactionReceipt } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
  getFunctionInputKey,
} from "./utilsContract";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { formatVariableName } from "~~/utils/formatVariableName";
import { getCoolDisplayName } from "~~/utils/getCoolDisplayName";
import { ContractInput } from "./ContractInput";
import { TxReceipt } from "./TxReceipt";

type WriteOnlyFunctionFormProps = {
  abi: Abi;
  abiFunction: AbiFunction;
  onChange: () => void;
  contractAddress: Address;
  inheritedFrom?: string;
  nameFix: boolean;
  debug: boolean;
};

export const WriteOnlyFunctionForm = ({
  abi,
  abiFunction,
  onChange,
  contractAddress,
  inheritedFrom,
  nameFix,
  debug,
}: WriteOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { chain, isConnected } = useAccount();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !isConnected || !chain || chain?.id !== targetNetwork.id || chain?.name !== targetNetwork.name;
  const [triggerValidation, setTriggerValidation] = useState(false);
  const { data: result, isPending, writeContractAsync } = useWriteContract();

  const handleWrite = async () => {
    setTriggerValidation(true);
    setTimeout(() => setTriggerValidation(false), 500);
    if (writeContractAsync) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: contractAddress,
            functionName: abiFunction.name,
            abi: abi,
            args: getParsedContractFunctionArgs(form),
            value: BigInt(txValue),
          });
        await writeTxn(makeWriteWithParams);
        onChange();
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  const transformedFunction = transformAbiFunction(abiFunction);
  const inputs = useMemo(
    () =>
      transformedFunction.inputs.map((input, inputIndex) => {
        const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
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
      }),
    [transformedFunction, abiFunction.name, triggerValidation, form],
  );
  const zeroInputs = inputs.length === 0 && abiFunction.stateMutability !== "payable";

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">
          {nameFix ? formatVariableName(abiFunction.name) : abiFunction.name}
          <InheritanceTooltip inheritedFrom={inheritedFrom} />
        </p>
        {inputs}
        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="block text-xs font-extralight leading-none">wei</span>
            </div>
            <IntegerInput
              value={txValue}
              onChange={updatedTxValue => {
                setDisplayedTxResult(undefined);
                setTxValue(updatedTxValue);
              }}
              placeholder="value (wei)"
            />
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          {!zeroInputs && (
            <div className="flex-grow basis-0">
              {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
            </div>
          )}
          <div
            className={`flex ${
              writeDisabled &&
              "tooltip tooltip-secondary before:content-[attr(data-tip)] before:right-[10px] before:left-auto before:transform-none"
            }`}
            data-tip={!isConnected ? "Connect your wallet" : `Change network to ${targetNetwork.name}`}
          >
            <button
              className="btn btn-secondary btn-sm rounded-xl min-h-[40px] font-bold"
              disabled={writeDisabled || isPending}
              onClick={handleWrite}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : debug ? (
                "💸 Send"
              ) : (
                getCoolDisplayName(abiFunction.name)
              )}
            </button>
          </div>
        </div>
      </div>
      {zeroInputs && txResult ? (
        <div className="flex-grow basis-0">
          <TxReceipt txResult={txResult} />
        </div>
      ) : null}
    </div>
  );
};
