This project aims to create a cool interface for managing Novem Gold tokens via the write functions of the smart contracts. It is developed using a forked version of [Scaffold Eth-2](https://github.com/scaffold-eth/scaffold-eth-2)

# APP Routes

## [id] Page

The dynamically routed [id] page displays transactions fetched from BSC Scan and an analytics table for the respective smart contracts. Through the custom-designed function table, users can access the write functions of the smart contracts.

### [id]/\_components

This folder contains components used on the token's page, including:

- **Token's Transactions Table**: Displays the transactions of the token fetched from BSC Scan.
- **Analytic Graph**: Visualizes various metrics and data analytics related to the token.
- **Function Container**: Provides access to the smart contract's write functions through a custom-designed table.

#### /TokenPage.tsx

This component integrates the TokenUI and SideBar components, manages the opening and closing of the sidebar, and uses Scaffold-Eth-2's useDeployedContractInfo hook to fetch the ABI and deployedContractData for the relevant contract, passing this data to TokenUI.

### /TokenUi.tsx

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 or v20 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

1. Clone this repo & install dependencies

```
git clone https://github.com/0x74h51N/tokens_ui/
cd tokens_ui
yarn install
```

2. Start your NextJS app:

```
yarn start
```

You can interact with your smart contract on `http://localhost:3000`.
