import { Address } from "viem";
import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  testnetContractAddressList: Address[];
  contractAddressList: Address[];
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.bsc, chains.bscTestnet],

  // The interval at which your front-end polls the RPC servers for new data
  // BSC Scan transactions, uniswap native currency price
  pollingInterval: 30000,

  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  testnetContractAddressList: [
    "0x70aF4c67f16019C13516D814aAf9A6aD74CFd2F4",
    "0x9eB947Be4de53332022Edbc51528d33EB5D80f94",
    "0xdC7B8A96e0Ce131E1C0562BB0Cf35F12a0D1b6d6",
    "0x891F52b828C7242dC95D38903D387D7d12e33CB2",
  ],
  contractAddressList: [
    "0x5D5c5c1d14FaF8Ff704295b2F502dAA9D06799a0",
    "0xbe2D8AC2A370972C4328BED520b224C3903A4941",
    "0x55b6d96126879Fe99ca1f57A05F81941d0932F9C",
    "0xF9f594D86AEF52644473edC43B6dC9656E4fD2Ce",
  ],
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
