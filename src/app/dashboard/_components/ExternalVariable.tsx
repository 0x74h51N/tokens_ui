import React, { Fragment, useCallback, useEffect, useState } from "react";
import DisplayExternalVariables from "./DisplayExternalVariables";
import { CoinData } from "~~/services/web3/getCoinGeckoData";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import scaffoldConfig from "~~/scaffold.config";

/**
 * ExternalVariable Component
 *
 * This component fetches and displays the price, circulating supply,
 * and market capitalization of a specified token/coin by using data
 * from the CoinGecko API. It regularly updates this data at specified intervals.
 *
 * @param contractName - The name of the token/coin contract,
 * which should match the contract name in the ABI. This is used
 * to identify the token/coin when fetching data from the API.
 *
 * @returns A list of external variables (price, circulating supply, market cap)
 * displayed in a format determined by the `DisplayExternalVariables` component.
 */
const ExternalVariable = ({ contractName }: { contractName: ContractName }) => {
  const [isFetch, setFetching] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const currency = scaffoldConfig.currency;
  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/get-price?tokenName=${contractName.toLowerCase()}&currency=${currency.name}`);
      if (!response.ok) {
        throw new Error("API Network response was not ok");
      }
      const data: CoinData = await response.json();
      setPrice(data.price);
      setSupply(data.total_supply);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setFetching(false);
    }
  }, [contractName]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [fetchData]);
  const variables = [
    {
      name: "Price",
      value: price,
    },
    {
      name: "Circulating Supply",
      value: supply,
    },
    {
      name: "Market Cap",
      value: price * supply,
    },
  ];

  return (
    <>
      {variables.map((variable, i) => {
        return (
          <Fragment key={variable.name + " " + i}>
            <DisplayExternalVariables
              variable={variable}
              fetchData={fetchData}
              isFetch={isFetch}
              contractName={contractName}
              currencySymbol={currency.symbol}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default ExternalVariable;
