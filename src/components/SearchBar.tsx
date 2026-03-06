import { TextInput, ActionIcon } from "@mantine/core";
import { Search } from "@nine-thirty-five/material-symbols-react/rounded";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "SEARCH",
  onSearch,
  onChange,
  value: controlledValue,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.(value);
  };

  return (
    <TextInput
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      radius={10}
      styles={{
        root: { width: "23.313rem" },
        input: {
          letterSpacing: "0.12em",
          fontSize: "0.75rem",
          border: "1px solid var(--mantine-color-gray-3)",
          paddingRight: "2.5rem",
          height: "2.25rem",
          minHeight: "2.5rem",
          textAlign: "center",
        },
        section: {
          width: "3.5rem",
          height: "100%",
        },
      }}
      rightSection={
        <ActionIcon
          onClick={() => onSearch?.(value)}
          radius={10}
          h="100%"
          w="100%"
          style={{
            backgroundColor: "var(--mantine-color-jltBlue-8)",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          aria-label="Search"
        >
          <Search width={18} height={18} fill="white" />
        </ActionIcon>
      }
    />
  );
}
