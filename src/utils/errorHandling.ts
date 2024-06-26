import { notification } from "~~/utils/scaffold-eth";

const ERROR_MESSAGES = {
  INVALID_ADDRESS: "Please enter a valid address.",
  AMOUNT_EMPTY: "Amount field cannot be empty.",
  DECIMAL_SEPARATOR: 'Use dot "." for decimal separator.',
};
export const handleInputError = (
  inputRef: React.RefObject<HTMLInputElement> | null,
  errorKey?: keyof typeof ERROR_MESSAGES,
  errorTrue = true,
) => {
  const currentInput = inputRef?.current;
  if (errorKey && errorTrue) {
    const errorMessage = ERROR_MESSAGES[errorKey];
    notification.error(errorMessage);
    if (currentInput) {
      currentInput.classList.add("border-red-900");
      currentInput.parentElement?.classList.add("border-red-900");
      currentInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        currentInput.focus();
      }, 500);
    }
  } else if (currentInput) {
    currentInput.classList.remove("border-red-900");
    currentInput.parentElement?.classList.remove("border-red-900");
  }
};
