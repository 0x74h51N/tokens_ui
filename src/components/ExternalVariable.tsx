import React, { Fragment, useCallback, useEffect, useState } from "react";
import DisplayExternalVariables from "./DisplayExternalVariables";
import { CoinData } from "~~/services/web3/getCoinGeckoData";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const ExternalVariable = ({ contractName }: { contractName: ContractName }) => {
  const [isFetch, setFetching] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/get-price?tokenName=${contractName.toLowerCase()}&currency=usd`);
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
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default ExternalVariable;
