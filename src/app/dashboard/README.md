## Tree

```
├── dashboard
│   ├── README.md
│   ├── _components
│   │   ├── AddTag.tsx
│   │   ├── DisplayExternalVariables.tsx
│   │   ├── ExternalVariable.tsx
│   │   └── SideBar.tsx
│   ├── [id]
│   │   ├── _components
│   │   │   ├── DateFilterTransactions.tsx
│   │   │   ├── FunctionContainer
│   │   │   │   ├── FunctionContainer.tsx
│   │   │   │   ├── FunctionTitles.tsx
│   │   │   │   └── SearchDropdown.tsx
│   │   │   ├── TokenAnalytics
│   │   │   │   ├── TokenAnalytics.tsx
│   │   │   │   └── _utils
│   │   │   │       ├── chartOptions.ts
│   │   │   │       ├── colors.ts
│   │   │   │       ├── dataGroupFuncs.ts
│   │   │   │       └── verticalLinePlugin.ts
│   │   │   ├── TokenPage.tsx
│   │   │   ├── TokenUi.tsx
│   │   │   └── Transactions
│   │   │       ├── DownloadCSVButton.tsx
│   │   │       ├── HandlePages.tsx
│   │   │       ├── TableHead.tsx
│   │   │       ├── TransactionFilterHead.tsx
│   │   │       ├── TransactionHash.tsx
│   │   │       └── TransactionTable.tsx
│   │   └── page.tsx
├── debug
│   │   ├── _components
│   │   │   ├── DebugContracts.tsx
│   │   │   └── contract
│   │   │       ├── ContractInput.tsx
│   │   │       ├── ContractReadMethods.tsx
│   │   │       ├── ContractUI.tsx
│   │   │       ├── ContractVariables.tsx
│   │   │       ├── ContractWriteMethods.tsx
│   │   │       ├── DisplayVariable.tsx
│   │   │       ├── InheritanceTooltip.tsx
│   │   │       ├── ReadOnlyFunctionForm.tsx
│   │   │       ├── Tuple.tsx
│   │   │       ├── TupleArray.tsx
│   │   │       ├── TxReceipt.tsx
│   │   │       ├── WriteOnlyFunctionForm.tsx
│   │   │       ├── index.tsx
│   │   │       ├── utilsContract.tsx
│   │   │       └── utilsDisplay.tsx
│   │   └── page.tsx
│   └── layout.tsx
├── layout.tsx
```

# Dashboard Components

The dashboard in this project is designed to provide a comprehensive UI for managing and interacting with smart contracts. The primary functionality of this dashboard is to display dynamic data related to specific tokens and provide tools for users to interact with these contracts directly. The components within this dashboard are modular and designed for reuse across different parts of the application.
Dashboard Structure

The dashboard directory is organized to maintain clarity and separation of concerns:

- \_components/: This directory contains reusable components that are utilized across the dashboard. These include components for managing tags, displaying external variables, and presenting sidebars with key contract details.
- [id]/: This directory represents dynamic routes where each token has its unique page. Inside, \_components houses all UI elements specific to the token pages, such as analytics, transaction tables, and filtering tools.
- debug/: Although not directly part of the main dashboard, this section contains tools and utilities for debugging smart contracts, including UI elements for interacting with contract functions and viewing their states.

## AddTag.tsx

The AddTag component is designed to provide a user-friendly interface for managing tags associated with specific smart contract addresses. This component allows users to add, update, or remove tags, ensuring that tags are consistently managed both in the application's global state and in secure cookies for persistent storage.
Features

- Tag Management: Users can add a new tag, update an existing tag, or remove a tag associated with a smart contract address.
- Global State and Cookie Synchronization: Tags are stored in the application's global state and securely saved in a cookie using JWT tokens. This ensures that tags persist across sessions and are available wherever needed in the application.
- Validation: The component prevents duplicate tags from being assigned to different addresses, ensuring each tag is unique across the system.
- Dynamic UI: The input field and buttons dynamically appear based on user interaction, providing a clean and intuitive user experience.

### Props

```typescript
address: "The smart contract address for which the tag is being managed.";
```

### Detailed Description

- Global State Integration: The AddTag component uses the useGlobalState hook to access and update the global state. This ensures that tags are accessible throughout the application and can be displayed wherever the associated contract address is used.
- Cookie Management: The component uses JWT tokens to store tags in a secure cookie. This is managed by the createTagsToken and removeTagFromCookie functions, which are called whenever a tag is added, updated, or removed.
- Validation and Error Handling: The component checks if a tag is already used for another address. If so, it displays an error message and prevents the tag from being saved.
- Dynamic Input Handling: The input field for adding or editing a tag is only shown when needed, providing a cleaner UI. The field automatically disappears when clicked outside or when the user presses the Escape key.

### Methods

- handleOnClick: Toggles the visibility of the input field and resets any error states.
- handleOnChange: Validates the tag input to ensure it isn't already used for another address. If valid, it updates the input value.
- handleKeyDown: Handles the Enter and Escape keys to either save the tag or close the input field.
- addTag: Adds or updates the tag in both the global state and the cookie. If the tag is empty, it removes the tag from both storage locations.

## SideBar.tsx

The SideBar component is designed to display essential information about a deployed smart contract, including its address, associated network, and key variables. Additionally, it integrates external data from CoinGecko to provide real-time insights into the contract's token metrics.

### Features

- Smart Contract Information: Displays the smart contract's address and the network it's deployed on.
- Contract Variables: Shows specific contract variables such as name, symbol, totalSupply, and paused.
- External Data Integration: For contracts deployed on mainnets, fetches and displays additional data from CoinGecko related to the token's price, supply, and market capitalization.

### Props

```typescript
contractName: "The name of the contract being displayed.";
refreshDisplayVariables: "A boolean flag that triggers a refresh of the displayed contract variables.";
deployedContractData: "An object containing data related to the deployed contract, including its address and ABI.";
```

## ExternalVariable Component

The ExternalVariable component is a key part of the SideBar that is responsible for fetching and displaying external data from CoinGecko.

### Features

- Data Fetching: Retrieves token price, circulating supply, and market cap from CoinGecko based on the contract name.
- Real-Time Updates: Regularly updates the displayed data at specified intervals to ensure the information remains current.

### Props

```typescript
contractName: "The name of the contract for which external data is being fetched. This name is used to query the correct token data from CoinGecko.";
```

The ExternalVariable component is conditionally rendered within the SideBar, depending on the network. It is only shown if the contract is deployed on a mainnet, as testnets typically do not have relevant market data on CoinGecko. Using DisplayExternalVariable component for shos on SideBar.

# [id]

TODO

## [id]/\_components

This folder contains components used on the token's page, including:

- **Token's Transactions Table**: Displays the transactions of the token fetched from BSC Scan.
- **Analytic Graph**: Visualizes various metrics and data analytics related to the token.
- **Function Container**: Provides access to the smart contract's write functions through a custom-designed table.

#### /TokenPage.tsx

This component integrates the TokenUI and SideBar components, manages the opening and closing of the sidebar, and uses Scaffold-Eth-2's useDeployedContractInfo hook to fetch the ABI and deployedContractData for the relevant contract, passing this data to TokenUI.

### /TokenUi.tsx
