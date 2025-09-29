import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

export default function Transactions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // smaller per-page makes UI faster
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchPage = useCallback(async () => {
    try {
      const params = { page, limit, q: search, category };
      const res = await api.get("/transactions", { params });

      setTransactions(res.data.rows || []);
      setTotal(res.data.total || (res.data.rows?.length || 0));
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }, [page, limit, search, category]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleDelete = async (id) => {
    if (!confirm("Delete transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchPage(); // reload after delete
    } catch (err) {
      alert("Delete failed");
    }
  };

  const totalAmount = useMemo(() => {
    return transactions.reduce(
      (sum, t) =>
        sum + Number(t.amount || 0) * (t.type === "expense" ? -1 : 1),
      0
    );
  }, [transactions]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Transactions</h2>

      {/* Filters */}
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Salary</option>
        </select>

        {user?.role === "admin" || user?.role === "user" ? (
          <Link to="/transactions/new">
            <button style={{ marginLeft: 8 }}>Add</button>
          </Link>
        ) : (
          <button disabled title="read-only users cannot add" style={{ marginLeft: 8 }}>
            Add (read-only)
          </button>
        )}
      </div>

      {/* Transaction list */}
      <div style={{ maxHeight: 400, overflowY: "auto", border: "1px solid #ddd" }}>
        {transactions.length === 0 ? (
          <div style={{ padding: 12 }}>No transactions found</div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                gap: 12,
                padding: 8,
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ width: 120 }}>
                {t.date ? format(new Date(t.date), "yyyy-MM-dd") : ""}
              </div>
              <div style={{ flex: 1 }}>{t.description}</div>
              <div style={{ width: 120 }}>{t.category}</div>
              <div style={{ width: 120, color: t.type === "income" ? "green" : "red" }}>
                {t.type === "income" ? "+" : "-"}
                {t.amount}
              </div>
              <div>
                {(user?.role === "admin" || user?.role === "user") && (
                  <>
                    <button onClick={() => navigate(`/transactions/${t.id}/edit`)}>Edit</button>
                    <button onClick={() => handleDelete(t.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 12 }}>
        Page: {page} / {Math.max(1, Math.ceil(total / limit))}
      </div>
      <div>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <button
          onClick={() =>
            setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))
          }
        >
          Next
        </button>
      </div>

      {/* Totals */}
      <div style={{ marginTop: 12 }}>
        Page total (approx):{" "}
        <span style={{ color: totalAmount >= 0 ? "green" : "red" }}>
          {totalAmount}
        </span>
      </div>
    </div>
  );
}
