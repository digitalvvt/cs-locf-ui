import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";

export type SearchInputProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
  allowClear?: boolean;
  fireOnMount?: boolean;
  size?: "sm" | "md" | "lg";
};

export function SearchInput({
  onSearch,
  placeholder = "Search...",
  debounceMs = 400,
  defaultValue = "",
  className = "",
  inputClassName = "",
  autoFocus = false,
  ariaLabel = "Search",
  allowClear = true,
  fireOnMount = false,
  size = "md",
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, setIsPending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // NEW: keep input in sync if parent changes defaultValue (e.g., resets on filter/page change)
  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  // Debounce effect
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPending(true);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
      setIsPending(false);
    }, Math.max(0, debounceMs));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs]);

  // Optional initial fire (only if defaultValue is non-empty)
  useEffect(() => {
    if (fireOnMount && defaultValue) {
      onSearch(defaultValue.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizes = useMemo(() => {
    switch (size) {
      case "sm":
        return { wrapper: "h-9", input: "h-9 pl-9 pr-10 text-sm" };
      case "lg":
        return { wrapper: "h-12", input: "h-12 pl-10 pr-12 text-base" };
      default:
        return { wrapper: "h-10", input: "h-10 pl-9 pr-12" };
    }
  }, [size]);

  const clear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPending(true);
      onSearch(value.trim());
      setTimeout(() => setIsPending(false), 120);
    } else if (e.key === "Escape") {
      clear();
    }
  };

  return (
    <div className={`relative ${sizes.wrapper} ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        <Search className="h-4 w-4" aria-hidden />
      </div>

      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        className={`peer ${sizes.input} ${inputClassName} pr-12`}
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-1">
        {isPending ? (
          <Loader2
            className="mr-2 h-4 w-4 animate-spin text-muted-foreground"
            aria-label="Searching"
          />
        ) : allowClear && value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clear}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-2" />
        )}
      </div>
    </div>
  );
}

// (Optional) local demo remains unchanged if you keep it
export default function DemoSearchInput() {
  const [query, setQuery] = useState("");
  return (
    <div className="max-w-xl space-y-3">
      <SearchInput
        onSearch={setQuery}
        placeholder="Search chapters, concepts, students..."
        debounceMs={400}
        fireOnMount
      />
      <p className="text-sm text-muted-foreground">
        Debounced query: <span className="font-medium text-foreground">{query || "(empty)"}</span>
      </p>
    </div>
  );
}
