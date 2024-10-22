# 🪙 Novem Gold BSC Token's UI

This project aims to create a cool interface for managing Novem Gold tokens via the write functions of the smart contracts. It is developed using a forked version of [Scaffold Eth-2](https://github.com/scaffold-eth/scaffold-eth-2)

- [🪙 Novem Gold BSC Token's UI](#-novem-gold-bsc-tokens-ui)
  - [🌳SRC Tree](#src-tree)
  - [🛠️ Techs](#️-techs)
  - [👜 Requirements](#-requirements)
  - [🚀 Quickstart](#-quickstart)
- [🪧 APP Routes](#-app-routes)
  - [📑 Dashboard Pages](#-dashboard-pages)
    - [🧩 Dashboard Components](#-dashboard-components)

## 🌳SRC Tree

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

## 🛠️ Techs

```
- Framework:
  - Next.js 14 (App Routing)

- UI Libraries:
  - RainbowKit (Wallet UI)
  - Daisy-UI (Styling)
  - Tailwind CSS (Styling)

- State Management:
  - Zustand (Global State Management)

- Data Visualization:
  - Chart.js (Graphs and Charts)
  - React-Chartjs-2 (React Integration)

- Session Management & Auth:
  - iron-session (Session Management)
  - JSON Web Token (JWT) (Token Encryption & Authentication)
  - Auth0 (OAuth and Identity Management)

- Blockchain Integration:
  - Wagmi (Wallet Connection)
  - BSC API (Smart Contract Functions)
  - Scaffold Eth-2 (Smart Contract Integration)

- API Integration:
  - CoinGecko API (Price & Market Data)
  - BSC Scan API (Transaction History)

- Middleware and Server Functions:
  - Next.js Server Actions & API
  - Secure Cookie Management

- Build & Deployment:
  - Vercel (Deployment)
  - Husky (Git Hooks)
  - Lint-staged (Pre-commit Hooks)
```

# 🪧 APP Routes

TODO

## 📑 Dashboard Pages

The dynamically routed [id] pages displays transactions fetched from BSC Scan and an analytics table for the respective smart contracts. Through the custom-designed function table, users can access the write functions of the smart contracts.

### 🧩 Dashboard Components

[For more detail.](/src/app/dashboard/README.md)
