# 🪙 Novem Gold BSC Token's UI

This project aims to create a cool interface for managing Novem Gold tokens via the write functions of the smart contracts. It is developed using a forked version of [Scaffold Eth-2](https://github.com/scaffold-eth/scaffold-eth-2)

- [🪙 Novem Gold BSC Token's UI](#-novem-gold-bsc-tokens-ui)
- [🌳SRC Tree](#src-tree)
- [🪧 APP Routes](#-app-routes)
  - [📑 Dashboard Pages](#-dashboard-pages)
    - [🧩 Dashboard Components](#-dashboard-components)
  - [👜 Requirements](#-requirements)
  - [🚀 Quickstart](#-quickstart)

# 🌳SRC Tree

```

├── app
│   ├── api
│   ├── dashboard
│   ├── layout.tsx
│   └── login
├── components
│   ├── Auth0Connection.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ScaffoldEthAppWithProviders.tsx
│   ├── SwitchTheme.tsx
│   ├── ThemeProvider.tsx
│   ├── assets
│   └── scaffold-eth
├── contracts
│   ├── deployedContracts.ts
│   └── externalContracts.ts
├── hooks
│   ├── scaffold-eth
│   ├── useAuth.ts
│   └── useFetchTransactions.ts
├── lib
│   └── sessionOptions.ts
├── middleware.ts
├── next-env.d.ts
├── scaffold.config.ts
├── services
│   ├── cron
│   ├── store
│   └── web3
├── styles
│   └── globals.css
├── types
│   ├── abitype
│   └── utils.ts
├── utils
│   ├── formatPrice.ts
│   ├── formatTime.ts
│   ├── formatVariableName.ts
│   ├── getContractSymbol.ts
│   ├── getCoolDisplayName.ts
│   ├── getMethodName.ts
│   ├── jwt-token.ts
│   └── scaffold-eth
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .npmrc
├── actions.ts
```

# 🪧 APP Routes

TODO

## 📑 Dashboard Pages

The dynamically routed [id] pages displays transactions fetched from BSC Scan and an analytics table for the respective smart contracts. Through the custom-designed function table, users can access the write functions of the smart contracts.

### 🧩 Dashboard Components

[For more detail.](/src/app/dashboard/README.md)

## 👜 Requirements

Before you begin, you need to install the following tools:

- [Node (v18 or v20 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## 🚀 Quickstart

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
