import { PencilIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Address } from "viem";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { createTagsToken, removeTagFromCookie } from "~~/utils/jwt-token";
import { notification } from "~~/utils/scaffold-eth";

/**
 * AddTag Component
 *
 * This component allows users to add, update, or remove a tag associated with a specific smart contract address via PencilIcon.
 * Tags are managed both in a global state and in a secure cookie, ensuring they persist across sessions.
 *
 * - When a tag is added or updated, the new tag is saved in the global state and a JWT token is created to store it in a cookie.
 * - When a tag is removed, it is deleted from both the global state and the cookie.
 * - The component validates that the tag is not already used for another address before allowing it to be saved.
 *
 * @param address - The smart contract address to which the tag is associated.
 */
const AddTag = ({ address }: { address: Address }) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { setTag, tags, deleteTag } = useGlobalState(state => ({
    setTag: state.setTag,
    tags: state.tags,
    deleteTag: state.deleteTag,
  }));
  const [tag, setInputTag] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleOnClick = () => {
    setShowInput(!showInput);
    setError(false);
  };
  useOutsideClick(inputRef, () => showInput && setShowInput(false));

  useEffect(() => setInputTag(tags.get(address.toLocaleLowerCase()) || ""), [tags, address]);

  const addTag = async (_address: Address) => {
    const lowerCaseAddress = _address.toLowerCase();
    if (error) {
      notification.error("This tag is already used.");
      return;
    }
    const newTag = { address: lowerCaseAddress, tag };
    setShowInput(false);
    if (!tag) {
      deleteTag(lowerCaseAddress);
      await removeTagFromCookie({ addressTags: [newTag] });
    } else {
      setTag(address.toLowerCase(), tag);
      await createTagsToken({ addressTags: [newTag] });
    }
    setError(false);
  };

  const handleOnChange = (e: { target: { value: string } }) => {
    const newTag = e.target.value;
    setInputTag(newTag);

    if (
      Array.from(tags.entries()).some(([key, value]) => value === newTag && key.toLowerCase() !== address.toLowerCase())
    ) {
      setError(true);
      notification.error("This tag is already used.");
    } else {
      setError(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTag(address);
    } else if (e.key === "Escape") {
      setShowInput(false);
      setError(false);
    }
  };

  return (
    <div
      ref={inputRef}
      data-tip={tags.get(address.toLowerCase()) ? "Change this tag" : "Add tag on this address"}
      className="relative flex items-end tooltip tooltip-top tooltip-primary"
    >
      {showInput && (
        <div className="absolute -bottom-9 right-1 z-40 flex shadow-md shadow-black rounded-lg">
          <input
            type="text"
            placeholder="Tag name..."
            value={tag}
            autoFocus
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
            className={`input input-bordered focus:outline-offset-1 input-xs md:w-40 w-32 rounded-lg ${error ? "border-red-700 border-1 focus:outline-red-700" : ""}`}
          />
          <div className="absolute border-[1px] border-base-100 w-4 h-4 bg-secondary -top-2 left-10 -z-10 rotate-45 transform origin-center"></div>
          <button
            onClick={() => addTag(address.toLowerCase())}
            className="absolute shadow-md shadow-black right-0 btn btn-xs text-xs rounded-l-none rounded-r-lg btn-secondary z-20"
          >
            {tags.get(address.toLowerCase()) ? "Update" : "Add"}
          </button>
        </div>
      )}
      <button className="" onClick={handleOnClick}>
        <PencilIcon className="ml-2 self-end font-normal text-sky-600 h-4 w-4 cursor-pointer flex-shrink-0" />
      </button>
    </div>
  );
};

export default AddTag;
