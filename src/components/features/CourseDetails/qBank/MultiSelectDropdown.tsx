import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  id: number;
  name: string;
  chapterName?: string; // Optional unique value for the option
}

// Helper to consistently derive the unique value we will track in state.
const getOptionValue = (opt: Option): string => {
  // Prefer chapterName if provided, otherwise fall back to name or id
  return opt.chapterName ?? opt.name ?? String(opt.id);
};

interface MultiSelectProps {
  options: Option[];
  selectedCourse: string;
  onValueChange: (selected: string[]) => void; // Changed to string[]
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedCourse, onValueChange }) => {
  const [open, setOpen] = useState(false);
  // Keep track of the selected option values (unique strings derived from each option)
  const [selected, setSelected] = useState<string[]>([]);

  // Derive a list of all selectable values using the helper
  const allValues = options.map(getOptionValue);

  const isAllSelected = allValues.length > 0 && selected.length === allValues.length;

  useEffect(() => {
    onValueChange(selected);
  }, [selected]);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    setSelected(isAllSelected ? [] : allValues);
  };

  const prevCourseRef = useRef<string>(selectedCourse);

  useEffect(() => {
    const prev = prevCourseRef.current;

    if (selectedCourse === "") {
      // If cleared, remove selections
      setSelected([]);
    } else if (prev !== selectedCourse) {
      // If course changed, reset selections and close dropdown
      setSelected([]);
      setOpen(false);
    }

    prevCourseRef.current = selectedCourse;
  }, [selectedCourse]);

  if (!selectedCourse) {
    return (
      <div
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "#f9f9f9",
          color: "#888",
          fontStyle: "italic",
        }}
      >
        Select course first
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "white",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {isAllSelected
            ? "All selected"
            : selected.length > 0
            ? `${selected.length} selected`
            : "Select Outcomes"}
        </span>
        <span style={{ marginLeft: "8px" }}>{open ? <ChevronUp /> : <ChevronDown />}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 10,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {/* All Option */}
          {options.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderBottom: "1px solid #f0f0f0",
                fontWeight: "bold",
              }}
            >
              <input
                type="checkbox"
                id="multi-select-all"
                checked={isAllSelected}
                onChange={toggleAll}
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="multi-select-all" style={{ cursor: "pointer" }}>
                All
              </label>
            </div>
          )}

          {/* Individual Options */}
          {options.length === 0 ? (
            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              No data found
            </div>
          ) : (
            options.map((opt) => {
              const value = getOptionValue(opt);
              const id = `multi-select-${opt.id}`;
              return (
                <div
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <input
                    type="checkbox"
                    id={id}
                    checked={selected.includes(value)}
                    value={value}
                    onChange={() => toggleOption(value)}
                    style={{ marginRight: "8px" }}
                  />
                  <label htmlFor={id} style={{ cursor: "pointer" }}>
                    {opt.name}
                  </label>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
