"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SortableTableHeader } from "@/components/admin/SortableTableHeader";

interface Tree {
  id: string;
  name: string;
  price: number;
  stock: number;
  reserved: number; // total (activeReserved + preorderReserved)
  activeReserved: number; // จอง
  preorderReserved: number; // สั่งล่วงหน้า
  sold: number;
  category: string;
  status: string;
}

export default function InventoryPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchTrees = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      setTrees(data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

  const handleUpdateStock = async (treeId: string) => {
    try {
      const res = await fetch(`/api/admin/trees/${treeId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        fetchTrees();
        setEditingId(null);
      } else {
        alert("ไม่สามารถอัปเดตสต็อกได้");
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getStockStatus = (stock: number, reserved: number) => {
    const available = Math.max(0, stock - reserved);
    if (available === 0) return { label: "หมด", color: "#ef4444" };
    if (available < 5) return { label: "ต่ำ", color: "#f59e0b" };
    return { label: "พร้อมขาย", color: "#22c55e" };
  };

  const filteredTrees = trees
    .filter((tree) => {
      const available = Math.max(0, tree.stock - tree.activeReserved);
      if (filter === "low") return available > 0 && available < 5;
      if (filter === "out") return available === 0;
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      let aValue: string | number = a[sortConfig.key as keyof Tree] as
        | string
        | number;
      let bValue: string | number = b[sortConfig.key as keyof Tree] as
        | string
        | number;

      // Special cases for calculated fields
      if (sortConfig.key === "available") {
        aValue = Math.max(0, a.stock - a.activeReserved);
        bValue = Math.max(0, b.stock - b.activeReserved);
      } else if (sortConfig.key === "reservedInStock") {
        aValue = a.activeReserved || 0;
        bValue = b.activeReserved || 0;
      } else if (sortConfig.key === "reservedOutStock") {
        aValue = a.preorderReserved || 0;
        bValue = b.preorderReserved || 0;
      } else if (sortConfig.key === "status") {
        // Approximate status sorting by available stock
        const aAvail = Math.max(0, a.stock - a.activeReserved);
        const bAvail = Math.max(0, b.stock - b.activeReserved);
        aValue = aAvail === 0 ? 0 : aAvail < 5 ? 1 : 2;
        bValue = bAvail === 0 ? 0 : bAvail < 5 ? 1 : 2;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalAvailable = trees.reduce(
    (sum, tree) => sum + Math.max(0, tree.stock - tree.activeReserved),
    0,
  );
  const totalReservedInStock = trees.reduce(
    (sum, tree) => sum + (tree.activeReserved || 0),
    0,
  );
  const totalReservedOutStock = trees.reduce(
    (sum, tree) => sum + (tree.preorderReserved || 0),
    0,
  );
  const totalSold = trees.reduce((sum, tree) => sum + tree.sold, 0);
  const lowStockCount = trees.filter((tree) => {
    const available = Math.max(0, tree.stock - tree.activeReserved);
    return available > 0 && available < 5;
  }).length;
  const outOfStockCount = trees.filter(
    (tree) => Math.max(0, tree.stock - tree.activeReserved) === 0,
  ).length;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            📦 จัดการสต็อก
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            ติดตามและจัดการสต็อกต้นไม้ทั้งหมด
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              สต็อกพร้อมขาย
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#22c55e" }}
            >
              {totalAvailable}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              จอง
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}
            >
              {totalReservedInStock}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              สั่งล่วงหน้า
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444" }}
            >
              {totalReservedOutStock}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              ขายไปแล้ว
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}
            >
              {totalSold}
            </div>
          </CardContent>
        </Card>
        <Card
          style={{ borderColor: lowStockCount > 0 ? "#f59e0b" : "#e5e7eb" }}
        >
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              ⚠️ สต็อกต่ำ
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}
            >
              {lowStockCount}
            </div>
          </CardContent>
        </Card>
        <Card
          style={{ borderColor: outOfStockCount > 0 ? "#ef4444" : "#e5e7eb" }}
        >
          <CardContent style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              ❌ หมดสต็อก
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444" }}
            >
              {outOfStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <CardContent style={{ padding: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border:
                  filter === "all" ? "2px solid #166534" : "1px solid #d1d5db",
                backgroundColor: filter === "all" ? "#dcfce7" : "white",
                fontWeight: filter === "all" ? 600 : 400,
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              ทั้งหมด ({trees.length})
            </button>
            <button
              onClick={() => setFilter("low")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border:
                  filter === "low" ? "2px solid #166534" : "1px solid #d1d5db",
                backgroundColor: filter === "low" ? "#dcfce7" : "white",
                fontWeight: filter === "low" ? 600 : 400,
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              สต็อกต่ำ ({lowStockCount})
            </button>
            <button
              onClick={() => setFilter("out")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border:
                  filter === "out" ? "2px solid #166534" : "1px solid #d1d5db",
                backgroundColor: filter === "out" ? "#dcfce7" : "white",
                fontWeight: filter === "out" ? 600 : 400,
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              หมดสต็อก ({outOfStockCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการสต็อก</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: "0" }}>
          {loading ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              กำลังโหลด...
            </div>
          ) : filteredTrees.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#f9fafb",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <tr>
                    <SortableTableHeader
                      label="ชื่อ"
                      sortKey="name"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="ราคา"
                      sortKey="price"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="สต็อกทั้งหมด"
                      sortKey="stock"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="จอง"
                      sortKey="reservedInStock"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="สั่งล่วงหน้า"
                      sortKey="reservedOutStock"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="พร้อมขาย"
                      sortKey="available"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="ขายไปแล้ว"
                      sortKey="sold"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      label="สถานะ"
                      sortKey="status"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrees.map((tree) => {
                    const available = Math.max(
                      0,
                      tree.stock - tree.activeReserved,
                    );
                    const status = getStockStatus(
                      tree.stock,
                      tree.activeReserved,
                    );
                    const isEditing = editingId === tree.id;

                    return (
                      <tr
                        key={tree.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontWeight: 500 }}>{tree.name}</div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#6b7280" }}
                          >
                            {tree.category
                              ? tree.category
                                  .split(",")
                                  .filter(Boolean)
                                  .join(", ")
                              : "-"}
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          ฿{tree.price.toLocaleString()}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={newStock}
                              onChange={(e) =>
                                setNewStock(Number(e.target.value))
                              }
                              style={{ width: "80px", textAlign: "center" }}
                              min={0}
                            />
                          ) : (
                            <span style={{ fontWeight: 600 }}>
                              {tree.stock}
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            textAlign: "center",
                            color: "#f59e0b",
                          }}
                        >
                          {tree.activeReserved || 0}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            textAlign: "center",
                            color: "#ef4444",
                          }}
                        >
                          {tree.preorderReserved || 0}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            textAlign: "center",
                            fontWeight: 600,
                            color: available === 0 ? "#ef4444" : "#22c55e",
                          }}
                        >
                          {available}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          {tree.sold}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: `${status.color}20`,
                              color: status.color,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {isEditing ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStock(tree.id)}
                                style={{ fontSize: "0.75rem" }}
                              >
                                บันทึก
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                style={{ fontSize: "0.75rem" }}
                              >
                                ยกเลิก
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(tree.id);
                                setNewStock(tree.stock);
                              }}
                              style={{ fontSize: "0.75rem" }}
                            >
                              แก้ไข
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              ไม่พบข้อมูล
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
