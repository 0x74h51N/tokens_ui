import React, { Fragment, useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";
import { formatPrice } from "~~/utils/formatPrice";
import { CoinData } from "~~/utils/getPrice";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const ExternalVariable = ({ contractName }: { contractName: ContractName }) => {
  const [isFetch, setFetching] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const suffix = "token";

  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

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

  return variables.map((variable, i) => {
    const { showAnimation } = useAnimationConfig(variable.value);
    return (
      <Fragment key={variable.name + " key " + i}>
        <div className="flex items-center">
          <h3 className="font-medium text-lg mb-0 break-all">{variable.name}</h3>
          <button className="btn btn-ghost btn-xs" onClick={async () => await fetchData()}>
            {isFetch ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="text-gray-500 font-medium flex flex-col items-start">
          <div
            className={`break-all block transition bg-transparent ${
              showAnimation ? "bg-warning rounded-sm animate-pulse-fast" : ""
            }`}
          >
            {variable.value
              ? variable.name.includes("Supply")
                ? formatPrice(variable.value) + " " + contractSymbol
                : "$" + formatPrice(variable.value)
              : 0}
          </div>
        </div>
      </Fragment>
    );
  });
};

export default ExternalVariable;
