"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";
import { GenericType } from "@/types";

interface LabeledOption { label: string; value: string }

interface MultiSelectDropdownProps {
  // Legacy generic mode (backward compatible)
  options?: GenericType[];                 // { id: string|number; name: string }
  selectedItems?: GenericType[] | null;
  onChange?: (items: GenericType[]) => void;

  // New controlled labeled mode
  labeledOptions?: LabeledOption[];
  value?: string[];                        // selected values
  onValueChange?: (values: string[]) => void;
  onSearchChange?: (query: string) => void; // bubble search to parent for debounced fetch
  loading?: boolean;
  maxTagCount?: number;                    // cap visible badges in trigger
  compactChips?: boolean;                  // if true, always show "N selected" badge in labeled mode

  placeholder?: string;
  className?: string;
  disabled?: boolean;

  // Optional built-in search UI trigger
  searchable?: boolean;                   // default: false
  minSearchItems?: number;                // show search only if options >= this (default: 6)
  searchPlaceholder?: string;             // default: "Search..."
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  // legacy
  options = [],
  selectedItems,
  onChange,
  // new
  labeledOptions,
  value,
  onValueChange,
  onSearchChange,
  loading = false,
  maxTagCount = 3,
  // common
  placeholder = "Select options",
  className = "",
  disabled = false,
  searchable = false,
  minSearchItems = 6,
  searchPlaceholder = "Search...",
  compactChips = false,
}) => {
  const isLabeledMode = Array.isArray(labeledOptions) && Array.isArray(value) && typeof onValueChange === "function";
  const safeSelected = (selectedItems ?? []);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const showSearch = searchable || Boolean(onSearchChange);

  // Derived data for both modes
  const genericFiltered = React.useMemo(() => {
    if (!options) return [] as GenericType[];
    const q = query.trim().toLowerCase();
    if (!showSearch || !q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query, showSearch]);

  const labeledFiltered = React.useMemo(() => {
    const items = labeledOptions ?? [];
    const q = query.trim().toLowerCase();
    if (!showSearch || !q) return items;
    return items.filter((o) => o.label.toLowerCase().includes(q));
  }, [labeledOptions, query, showSearch]);

  const isAllSelected = React.useMemo(() => {
    if (isLabeledMode) {
      const opts = labeledOptions ?? [];
      const curr = new Set(value ?? []);
      if (opts.length === 0) return false;
      // Consider preselected values that might be out of current options
      return curr.size > 0 && opts.every((o) => curr.has(o.value));
    }
    return options.length > 0 && safeSelected.length === options.length;
  }, [isLabeledMode, labeledOptions, options, safeSelected.length, value]);

  // Toggle handlers per mode
  const toggleSelectionGeneric = (item: GenericType) => {
    if (disabled || !onChange) return;
    const already = safeSelected.some((i) => i.id === item.id);
    onChange(already ? safeSelected.filter((i) => i.id !== item.id) : [...safeSelected, item]);
  };

  const toggleSelectionLabeled = (opt: LabeledOption) => {
    if (disabled || !isLabeledMode || !onValueChange) return;
    const curr = value ?? [];
    const already = curr.includes(opt.value);
    onValueChange(already ? curr.filter((v) => v !== opt.value) : [...curr, opt.value]);
  };

  // Select All affects ALL options (not just filtered), same as your original
  const toggleSelectAll = () => {
    if (disabled) return;
    if (isLabeledMode) {
      const all = (labeledOptions ?? []).map((o) => o.value);
      // Keep any already-selected values that are not in current options (preserve across filter changes)
      const curr = new Set(value ?? []);
      const outOfScope = Array.from(curr).filter((v) => !(labeledOptions ?? []).some((o) => o.value === v));
      const next = isAllSelected ? outOfScope : [...outOfScope, ...all];
      onValueChange?.(next);
    } else {
      onChange?.(isAllSelected ? [] : [...options]);
    }
  };

  const clearAll = () => {
    if (disabled) return;
    if (isLabeledMode) onValueChange?.([]);
    else onChange?.([]);
  };

  const selectedMeta = React.useMemo(() => {
    if (isLabeledMode) {
      const map = new Map((labeledOptions ?? []).map((o) => [o.value, o.label] as const));
      const vals = value ?? [];
      const labels = vals.map((v) => map.get(v));
      const missing = labels.filter((l) => !l).length;
      return {
        count: vals.length,
        labels: labels.filter(Boolean) as string[],
        hasMissing: missing > 0,
      };
    }
    return { count: safeSelected.length, labels: safeSelected.map((i) => i.name), hasMissing: false };
  }, [isLabeledMode, labeledOptions, safeSelected, value]);

  const stopWheel = (e: React.WheelEvent) => e.stopPropagation();
  const stopTouchMove = (e: React.TouchEvent) => e.stopPropagation();
  const stopPointerMove = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between truncate h-10 ${className}`}
          disabled={disabled}
        >
          <span className="truncate block max-w-[220px] text-left flex items-center gap-1 overflow-hidden whitespace-nowrap">
            {(() => {
              if (isLabeledMode) {
                if (selectedMeta.count === 0) return placeholder;
                // Keep height stable: if more than maxTagCount, show compact summary
                if (compactChips || selectedMeta.hasMissing || selectedMeta.count > maxTagCount) {
                  return <Badge variant="secondary">{selectedMeta.count} selected</Badge>;
                }
                const visible = selectedMeta.labels.slice(0, maxTagCount);
                const extra = selectedMeta.count - visible.length;
                return (
                  <span className="flex flex-wrap gap-1 items-center">
                    {visible.map((lbl, idx) => (
                      <Badge key={idx} variant="secondary" className="max-w-[120px] truncate">{lbl}</Badge>
                    ))}
                    {extra > 0 && <Badge variant="outline">+{extra}</Badge>}
                  </span>
                );
              }
              if (selectedMeta.count > 0) return selectedMeta.labels.join(", ");
              return placeholder;
            })()}
          </span>
          <div className="flex items-center gap-2">
            {safeSelected.length > 0 && (
              <X
                className="h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); clearAll(); }}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-2 w-[var(--radix-popover-trigger-width)]"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* optional search */}
        {showSearch && labeledOptions?.length > 0 && (
          <div className="mb-2">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSearchChange?.(e.target.value); }}
              placeholder={searchPlaceholder}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.stopPropagation()} // iOS viewport jump guard
            />
          </div>
        )}

        {(isLabeledMode ? (labeledOptions?.length ?? 0) === 0 : options.length === 0) ? (
          <div className="text-sm text-muted-foreground px-2 py-1 text-center">
            {loading ? "Loading..." : "No data found"}
          </div>
        ) : (
          <div
            className="space-y-1 max-h-60 overflow-auto overscroll-contain touch-pan-y"
            style={{ WebkitOverflowScrolling: "touch" }}
            onWheel={stopWheel}
            onTouchMove={stopTouchMove}
            onPointerMove={stopPointerMove}
          >
            {/* Select All */}
            <div
              className={`flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
              }`}
              onClick={toggleSelectAll}
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={isAllSelected} disabled={disabled} />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {(isLabeledMode ? (value?.length ?? 0) : safeSelected.length) > 0 && (
                <span className="text-xs text-muted-foreground">{isLabeledMode ? (value?.length ?? 0) : safeSelected.length} selected</span>
              )}
            </div>

            <hr className="my-1 border-muted" />

            {/* Options (filtered if search active) */}
            {(isLabeledMode ? labeledFiltered.length === 0 : genericFiltered.length === 0) ? (
              <div className="text-sm text-muted-foreground px-2 py-2 text-center">
                No matches{showSearch ? " for your search" : ""}
              </div>
            ) : (
              (isLabeledMode
                ? labeledFiltered.map((opt) => {
                    const checked = (value ?? []).includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer ${
                          disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
                        }`}
                        onClick={() => toggleSelectionLabeled(opt)}
                        role="menuitemcheckbox"
                        aria-checked={checked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSelectionLabeled(opt);
                          }
                        }}
                      >
                        <Checkbox checked={checked} disabled={disabled} />
                        <span className="text-sm">{opt.label}</span>
                      </div>
                    );
                  })
                : genericFiltered.map((opt) => {
                    const checked = safeSelected.some((i) => i.id === opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer ${
                          disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
                        }`}
                        onClick={() => toggleSelectionGeneric(opt)}
                        role="menuitemcheckbox"
                        aria-checked={checked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSelectionGeneric(opt);
                          }
                        }}
                      >
                        <Checkbox checked={checked} disabled={disabled} />
                        <span className="text-sm">{opt.name}</span>
                      </div>
                    );
                  }))
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;
