import { handleInputError } from "./errorHandling";

export const amountValidation = (amount: string, amountRef: React.RefObject<HTMLInputElement>): boolean => {
  if (amount === "" || amount === "0") {
    handleInputError(amountRef, "AMOUNT_EMPTY");
    return true;
  } else if (amount.includes(",")) {
    handleInputError(amountRef, "DECIMAL_SEPARATOR");
    return true;
  }
  return false;
};
