const getContractSymbol = (contractName: string) => {
  const suffix = "token";
  const contractSymbol = contractName.toLowerCase().endsWith(suffix)
    ? contractName.slice(0, -suffix.length).toUpperCase()
    : contractName.toUpperCase();
  return contractSymbol;
};

export default getContractSymbol;
