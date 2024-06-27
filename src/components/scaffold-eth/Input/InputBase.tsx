import { ChangeEvent, FocusEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseProps<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  reFocus?: boolean;
};

export const InputBase = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
  reFocus,
}: InputBaseProps<T>) => {
  const inputReft = useRef<HTMLInputElement>(null);

  const [modifier, setModifier] = useState<string>("");

  useEffect(() => {
    if (error) {
      setModifier("border-red-900");
    } else if (disabled) {
      setModifier("border-disabled bg-base-300");
    } else {
      setModifier("border-base-300");
    }
  }, [setModifier, disabled, error, onChange]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  // Runs only when reFocus prop is passed, useful for setting the cursor
  // at the end of the input. Example AddressInput
  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (reFocus !== undefined) {
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
    }
  };
  useEffect(() => {
    if (reFocus !== undefined && reFocus === true) inputReft.current?.focus();
  }, [reFocus]);

  return (
    <div className={`flex border-2 bg-base-200 !rounded-2xl text-accent ${modifier}`}>
      {prefix}
      <input
        className="input input-ghost focus-within:border-transparent focus:rounded-xl focus:outline-none rounded-xl focus:bg-base-300 focus:text-gray-400 h-[3rem] min-h-[3rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
        ref={inputReft}
        onFocus={onFocus}
      />
      {suffix}
    </div>
  );
};
