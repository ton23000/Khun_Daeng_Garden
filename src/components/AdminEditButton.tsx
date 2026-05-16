"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function AdminEditButton({
  editUrl,
  style,
}: {
  editUrl: string;
  style?: React.CSSProperties;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading || user?.role !== "admin") {
    return null;
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(editUrl);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "#166534",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #dcfce7",
        zIndex: 50,
        outline: "none",
        ...style,
      }}
      className="hover:scale-110"
      title="แก้ไขส่วนนี้"
    >
      <Pencil size={18} />
    </button>
  );
}
