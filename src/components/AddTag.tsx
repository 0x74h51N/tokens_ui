import { PencilIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Address } from "viem";
import { useGlobalState } from "~~/services/store/store";
import { createTagsToken } from "~~/utils/jwt-token";

const AddTag = ({ address }: { address: Address }) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [tag, setInputTag] = useState<string>("");
  const handleOnClick = () => {
    setShowInput(!showInput);
  };
  const cookieName = "tags";
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      showInput && setShowInput(false);
    }
  };
  const { setTag } = useGlobalState(state => ({
    setTag: state.setTag,
  }));
  const addTag = async (_address: Address) => {
    const newTag = { address: _address, tag };
    setTag(address, tag);
    setShowInput(false);
    await createTagsToken({ addressTags: [newTag] }, cookieName);
    setInputTag("");
  };

  useEffect(() => {
    if (showInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInput]);

  const handleOnChange = (e: { target: { value: string } }) => {
    setInputTag(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTag(address);
    }
  };

  return (
    <div
      ref={inputRef}
      data-tip="Add tag on this address"
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
            className="input input-bordered focus:outline-offset-1 input-xs md:w-40 w-32 rounded-lg"
          />
          <div className="absolute border-[1px] border-base-100 w-4 h-4 bg-secondary -top-2 left-10 -z-10 rotate-45 transform origin-center"></div>
          <button
            onClick={() => addTag(address)}
            className="absolute shadow-md shadow-black right-0 btn btn-xs rounded-l-none rounded-r-lg btn-secondary z-20"
          >
            Add
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
