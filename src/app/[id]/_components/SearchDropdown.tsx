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
        className="absolute input input-bordered md:w-40 w-32 rounded-lg right-0 -top-1"
      />
      {isDropdownVisible && (
        <ul className="absolute z-10 md:w-40 w-32 bg-base-200 border border-base-100 rounded right-0 top-12 text-sm max-h-40 overflow-y-auto overflow-x-hidden">
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
