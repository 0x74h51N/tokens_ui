"use client";

import React, { useRef, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { amountValidation } from "~~/utils/amountValidation";
import { handleInputError } from "~~/utils/errorHandling";

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
 * @param param0 - Contract name should be same as deployed contract name. Upper and lowercase are included. Also be sure this contract has been added in FunctionContainerProps.
 * @returns A container for the selected function (mint or burn) with input fields and a submit button.
 */
const FunctionContainer = ({ contractName, functionName }: FunctionContainerProps) => {
  const [addr, setAddr] = useState<string>("");
  const [amountMint, setAmount] = useState<string>("0");
  const [amountBurn, setAmountBurn] = useState<string>("0");
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const amountInputRefBurn = useRef<HTMLInputElement | null>(null);
  const { chain, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !isConnected || !chain || chain?.id !== targetNetwork.id || chain?.name !== targetNetwork.name;
  const suffix = "token";
  const showAddressInput = functionName === "mint" ? true : false;
  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();
  const titleText = functionName === "mint" ? "💵 Mint " + contractSymbol : "🔥 Burn " + contractSymbol;
  const buttonText = functionName === "mint" ? "💵 Mint" : "🔥 Burn";

  const handleAddrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputError(addressInputRef, undefined, false);
    setAddr(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputError(showAddressInput ? amountInputRef : amountInputRefBurn, undefined, false);
    showAddressInput ? setAmount(event.target.value) : setAmountBurn(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract(contractName);
  const argMint = parseEther(amountMint);
  const argBurn = parseEther(amountBurn);

  const asyncMint = async () => {
    try {
      await writeYourContractAsync({
        functionName: "mint",
        args: [addr as `0x${string}`, argMint],
      });
    } catch (e) {
      console.error("Error executing mint:", e);
    }
  };

  const asyncBurn = async () => {
    try {
      await writeYourContractAsync({
        functionName: "burn",
        args: [argBurn],
      });
    } catch (e) {
      console.error("Error executing burn:", e);
    }
  };

  const handleButtonClick = async () => {
    console.log(`${functionName} ${contractName} Token!`);
    if (showAddressInput) {
      if (!/^0x[0-9a-fA-F]{40}$/.test(addr.trim())) {
        return handleInputError(addressInputRef, "INVALID_ADDRESS");
      } else if (amountValidation(amountMint, amountInputRef)) {
        return;
      }
    } else {
      if (amountValidation(amountBurn, amountInputRefBurn)) {
        return;
      }
    }
    showAddressInput ? await asyncMint() : await asyncBurn();
  };

  return (
    <>
      <div className="flex flex-col mt-24 justify-center items-center w-full h-auto px-8">
        <div className="flex flex-col relative w-[35svw] min-w-[500px] max-sm:min-w-[350px] max-sm:w-full lg:max-w-[600px] items-center justify-center">
          <div className="flex h-[5.5rem] w-full pr-1 bg-base-300 absolute self-start rounded-[22px] -top-[55px] -left-[1px] shadow-lg shadow-base-300">
            <h1 className="antialiased font-bold text-3xl max-md:text-xl bold m-2 text-center w-full">{titleText}</h1>
          </div>
          <div className="relative w-full z-10 p-5 divide-y bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300">
            <div className="flex flex-col gap-6">
              <div>
                {showAddressInput && (
                  <>
                    <p className="text my-1">Address:</p>
                    <div>
                      <div className="flex min-h-[3.2rem] border-2 border-base-200 bg-base-200 rounded-2xl text-accent">
                        <input
                          placeholder="Wallet Address"
                          ref={addressInputRef}
                          className="input input-ghost focus:bg-transparent focus:text-gray-400 h-[3rem] min-h-[3rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-500 rounded-2xl"
                          onKeyDown={handleKeyDown}
                          onChange={handleAddrChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <p className="text my-1">Amount:</p>
                <div className="flex min-h-[3.2rem] border-2 border-base-200 bg-base-200 rounded-2xl text-accent">
                  <input
                    placeholder={`${contractSymbol} Token Amount`}
                    ref={showAddressInput ? amountInputRef : amountInputRefBurn}
                    className="input input-ghost focus:bg-transparent focus:text-gray-400  h-[3rem] min-h-[3rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400 rounded-2xl"
                    onChange={handleAmountChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end border-none mt-4 relative">
              <div
                className={`flex ${writeDisabled && "tooltip rounded-md"}`}
                data-tip={!isConnected ? "Connect your wallet" : `Change network to ${targetNetwork.name}`}
              >
                <button
                  className="btn btn-secondary btn-sm text-base rounded-xl w-[110px] h-[40px]"
                  disabled={writeDisabled}
                  onClick={handleButtonClick}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FunctionContainer;
