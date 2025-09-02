"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { GenericType } from "@/types";

interface MultiSelectDropdownProps {
  options: GenericType[];
  selectedItems: GenericType[] | null;
  onChange: (items: GenericType[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedItems,
  onChange,
  placeholder = "Select options",
  className = "",
  disabled = false,
}) => {
  const safeSelected = selectedItems ?? [];
  const isAllSelected = safeSelected.length === options.length;

  // Toggle one item
  const toggleSelection = (item: GenericType) => {
    if (disabled) return;
    const already = safeSelected.some((i) => i.id === item.id);
    const next = already ? safeSelected.filter((i) => i.id !== item.id) : [...safeSelected, item];
    onChange(next);
  };

  // Toggle all
  const toggleSelectAll = () => {
    if (disabled) return;
    onChange(isAllSelected ? [] : [...options]);
  };

  // For button label
  const selectedNames = safeSelected.map((i) => i.name).join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between truncate ${className}`}
          disabled={disabled}
        >
          <span className="truncate block max-w-[220px] text-left">
            {safeSelected.length > 0 ? selectedNames : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 w-[var(--radix-popover-trigger-width)]" align="start">
        {options.length === 0 ? (
          <div className="text-sm text-muted-foreground px-2 py-1 text-center">No data found</div>
        ) : (
          <div className="space-y-1 max-h-60 overflow-auto">
            {/* Select All */}
            <div
              className={`flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
              }`}
              onClick={toggleSelectAll}
            >
              <Checkbox checked={isAllSelected} disabled={disabled} />
              <span className="text-sm font-medium">Select All</span>
            </div>

            <hr className="my-1 border-muted" />

            {/* Individual Options */}
            {options.map((opt) => {
              const checked = safeSelected.some((i) => i.id === opt.id);
              return (
                <div
                  key={opt.id}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer ${
                    disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
                  }`}
                  onClick={() => toggleSelection(opt)}
                >
                  <Checkbox checked={checked} disabled={disabled} />
                  <span className="text-sm">{opt.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;
