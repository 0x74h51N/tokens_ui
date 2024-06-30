import { useState } from "react";

const SearchDropdown = ({ options, handleSelect }: { options: string[]; handleSelect: (option: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleOnChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    }
  };
  const handleOptionClick = (option: string) => {
    handleSelect(option);
    setIsDropdownVisible(false);
  };

  return (
    <div className="relative w-32">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleOnChange}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setIsDropdownVisible(false)}
        className="input input-bordered w-full rounded-xl"
      />
      {isDropdownVisible && (
        <ul className="absolute z-10 w-full bg-base-200 border border-base-100 rounded mt-1 text-sm max-h-40 overflow-y-auto pl-1 overflow-x-hidden">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleOptionClick(option)}
              className="p-2 hover:bg-base-100 cursor-pointer truncate"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
