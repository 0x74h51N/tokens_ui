import { useEffect } from "react";
import FunctionContainer from "./FunctionContainer/FunctionContainer";
import { TransactionsTable } from "./Transactions/TransactionTable";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import useFetchTransactions from "~~/hooks/useFetchTransactions";
import { useGlobalState } from "~~/services/store/store";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import TokenMetrics from "./TokenMetrics/TokenMetrics";

const TokenUI = ({
  deployedContractData,
  contractName,
  trigger,
}: {
  deployedContractData: Contract<ContractName>;
  contractName: ContractName;
  trigger: () => void;
}) => {
  const initialFunctions = ["mint", "burn"];
  const { targetNetwork } = useTargetNetwork();
  const testnet = targetNetwork.testnet || false;
  const address = deployedContractData.address;
  const { data, pending } = useFetchTransactions(true, testnet, deployedContractData.address);
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;
  const setTransactions = useGlobalState(state => state.setTransactions);
  const globalTransactions = useGlobalState(state => state.transactions[address]);

  useEffect(() => {
    if (data && data.length > 2 && isLoggedIn && data !== globalTransactions) {
      setTransactions(address, data);
    }
  }, [data, isLoggedIn, address, globalTransactions, setTransactions]);

  return (
    <>
      <div className="2xl:px-4 lg:px-2 px-0 lg:gap-6 my-0 pt-2 w-full h-full grid grid-cols-1 xl:grid-cols-7 2xl:grid-cols-9 gap-3">
        <div className="col-span-1 xl:col-span-4 2xl:col-span-5 h-full">
          {pending ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <TokenMetrics deployedContractData={deployedContractData} contractName={contractName} />
          )}
          <div className="w-full flex flex-col relative z-50">
            <FunctionContainer
              functionNames={initialFunctions}
              contractName={contractName}
              deployedContractData={deployedContractData}
              onChange={trigger}
            />
          </div>
        </div>
        <div className="col-span-1  xl:col-span-3 2xl:col-span-4 flex flex-col relative h-full shadow-md shadow-base-300 rounded-2xl border-base-300 border-2">
          <h1 className="w-full 2xl:text-3xl text-xl bg-base-300 p-4 pl-4 antialiased font-semibold rounded-t-xl m-0">
            <span className="relative">
              {contractName.toUpperCase()}

              {" Transactions"}
              <span
                data-tip="Contract transactions (max 30s delay)"
                className="absolute tooltip tooltip-info tooltip-right top-0 -right-2 text-[0.35em] text-xs cursor-help text-center before:max-w-[120px] before:top-4"
              >
                ?
              </span>
            </span>
          </h1>
          {pending ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <TransactionsTable deployedContractData={deployedContractData} contractName={contractName} />
          )}
        </div>
      </div>
    </>
  );
};

export default TokenUI;
