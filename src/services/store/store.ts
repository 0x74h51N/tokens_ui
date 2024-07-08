import { ExtendedTransaction } from "../web3/getBscTransactions";
import { Address } from "viem";
import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  contractFunctions: { [address: Address]: string[] };
  setContractFunctions: (address: Address, functions: string[]) => void;
  transactions: { [address: Address]: ExtendedTransaction[] };
  setTransactions: (address: Address, transactions: ExtendedTransaction[]) => void;
  sessionStart: boolean;
  setSessionStart: (isLogin: boolean) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newValue: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  contractFunctions: {},
  setContractFunctions: (address, functions) =>
    set(state => ({
      contractFunctions: {
        ...state.contractFunctions,
        [address]: functions,
      },
    })),
  transactions: {},
  setTransactions: (address, transactions) =>
    set(state => ({
      transactions: {
        ...state.transactions,
        [address]: transactions,
      },
    })),
  sessionStart: false,
  setSessionStart: isLogin => set(() => ({ sessionStart: isLogin })),
}));
