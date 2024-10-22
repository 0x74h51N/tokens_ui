import { Dispatch, ReactNode, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import CopyToClipboard from "react-copy-to-clipboard";
import { getAddress } from "viem";
import { Address } from "viem";
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { isENS } from "~~/components/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { ConnectButtonRendererProps } from "@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButtonRenderer";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  selectingNetwork: boolean;
  setSelectingNetwork: Dispatch<React.SetStateAction<boolean>>;
  chain: Pick<
    ConnectButtonRendererProps["children"] extends (renderProps: infer P) => ReactNode ? P : never,
    "chain"
  >["chain"];
};

export const AddressInfoDropdown = ({
  address,
  displayName,
  blockExplorerAddressLink,
  selectingNetwork,
  setSelectingNetwork,
  chain,
}: AddressInfoDropdownProps) => {
  const checkSumAddress = getAddress(address);
  const [addressCopied, setAddressCopied] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  return (
    <>
      <NetworkOptions hidden={!selectingNetwork} />
      <li className={selectingNetwork ? "hidden" : ""}>
        {addressCopied ? (
          <div className="btn-sm !rounded-xl flex gap-3 py-3">
            <CheckCircleIcon className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0" aria-hidden="true" />
            <span className=" whitespace-nowrap">Copy address</span>
          </div>
        ) : (
          <CopyToClipboard
            text={checkSumAddress}
            onCopy={() => {
              setAddressCopied(true);
              setTimeout(() => {
                setAddressCopied(false);
              }, 800);
            }}
          >
            <div className="btn-sm !rounded-xl flex gap-3 py-3">
              <DocumentDuplicateIcon
                className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">
                {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
              </span>
            </div>
          </CopyToClipboard>
        )}
      </li>
      <li className={selectingNetwork ? "hidden" : ""}>
        <label htmlFor="qrcode-modal" className="btn-sm !rounded-xl flex gap-3 py-3">
          <QrCodeIcon className="h-6 w-4 ml-2 sm:ml-0" />
          <span className="whitespace-nowrap">View QR Code</span>
        </label>
      </li>
      <li className={selectingNetwork ? "hidden" : ""}>
        <button className="menu-item btn-sm !rounded-xl flex gap-3 py-3" type="button">
          <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
          <a target="_blank" href={blockExplorerAddressLink} rel="noopener noreferrer" className="whitespace-nowrap">
            View on Block Explorer
          </a>
        </button>
      </li>
      {allowedNetworks.length > 1 ? (
        <li className={selectingNetwork ? "hidden" : ""}>
          <button
            className="btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={() => {
              setSelectingNetwork(true);
            }}
          >
            <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />{" "}
            <span>
              {chain?.unsupported || chain?.id !== targetNetwork.id ? (
                <label tabIndex={0} className="text-error dropdown-toggle gap-1 cursor-pointer">
                  <span>Wrong network</span>
                </label>
              ) : (
                "Switch Network"
              )}
            </span>
          </button>
        </li>
      ) : null}
    </>
  );
};
