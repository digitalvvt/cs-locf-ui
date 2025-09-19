"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GenericType } from "@/types";

interface SelectDropdownProps {
  options: GenericType[];
  value: GenericType | null; // ⬅️ now expects the full object
  onChange: (option: GenericType) => void; // ⬅️ sends full object
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) => {
  return (
    <Select
      value={value ? JSON.stringify(value) : ""}
      onValueChange={(val) => {
        const selectedObj = JSON.parse(val);
        onChange(selectedObj);
      }}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${className}`} disabled={disabled}>
        <SelectValue
          placeholder={placeholder}
          // To show selected name manually
          defaultValue={value ? JSON.stringify(value) : ""}
        >
          {value ? value.name : ""}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[var(--radix-select-trigger-width)]">
        {options.length > 0 ? (
          options.map((option) => (
            <SelectItem key={option.id} value={JSON.stringify(option)}>
              {option.name}
            </SelectItem>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-muted-foreground text-center">
            No data available
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
