"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  placeholder = "ค้นหา...",
  onSearch,
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <div style={{ position: "relative", maxWidth: "400px" }}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ paddingRight: query ? "2.5rem" : "1rem" }}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "1.25rem",
            padding: "0.25rem",
          }}
          title="ล้างการค้นหา"
        >
          ✕
        </button>
      )}
    </div>
  );
}
