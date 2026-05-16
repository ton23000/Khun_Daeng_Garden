"use client";

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string) => void;
  style?: React.CSSProperties;
}

export function SortableTableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  style,
}: SortableTableHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        padding: "1rem",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{label}</span>
        <span style={{ fontSize: "0.75rem", opacity: isActive ? 1 : 0.3 }}>
          {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
        </span>
      </div>
    </th>
  );
}
