"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchableSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function SearchableSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Ketik untuk mencari...",
  label,
  required = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        inputRef.current?.blur();
        break;
    }
  };

  // Handle option selection
  const handleSelect = (option: string) => {
    onChange(name, option);
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);

    // Clear selection if user is typing
    if (value && newValue !== value) {
      onChange(name, "");
    }
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(name, "");
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Reset search term when opening if there's a value
  const handleFocus = () => {
    if (value) {
      setSearchTerm("");
    }
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Display selected value or input for search */}
        <div className="relative">
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={value || searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={value || placeholder}
            className={`input w-full pr-20 ${
              value ? "text-neutral-900" : "text-neutral-500"
            }`}
            autoComplete="off"
          />

          {/* Action buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                tabIndex={-1}
              >
                <XMarkIcon className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              tabIndex={-1}
            >
              <ChevronDownIcon
                className={`w-5 h-5 text-neutral-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option, index) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors ${
                        index === highlightedIndex
                          ? "bg-primary-100 text-primary-900"
                          : value === option
                            ? "bg-primary-50 text-primary-700 font-medium"
                            : "text-neutral-700"
                      }`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                Tidak ada hasil yang ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      {!value && searchTerm && filteredOptions.length === 0 && (
        <p className="mt-1 text-xs text-red-500">
          Pilihan tidak tersedia. Silakan pilih dari daftar yang ada.
        </p>
      )}
    </div>
  );
}
