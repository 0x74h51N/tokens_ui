import { UserCircleIcon, WalletIcon } from "@heroicons/react/24/outline";
import React, { Dispatch } from "react";
import { useGlobalState } from "~~/services/store/store";

interface SignBtnProps {
  setPending?: Dispatch<React.SetStateAction<boolean>>;
  pending?: boolean;
  signText: string;
  signedText: string;
  onClick: () => void;
  wallet?: boolean;
}

const SignBtn = ({ setPending, pending = false, signText, signedText, onClick, wallet = false }: SignBtnProps) => {
  const { sessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
    sessionStart: state.sessionStart,
  }));
  const handleClick = () => {
    setPending && setPending(true);

    onClick();
  };
  return (
    <button
      className="flex w-full justify-between btn btn-primary bg-[#091e39] hover:bg-[#ae8c34] text-white rounded-md"
      onClick={handleClick}
    >
      {pending ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <span className="text-start">{sessionStart ? signedText : signText}</span>
      )}
      {wallet ? <WalletIcon className="h-8 w-6 ml-2 sm:ml-0" /> : <UserCircleIcon className="h-8 w-6 ml-2 sm:ml-0" />}
    </button>
  );
};

export default SignBtn;
