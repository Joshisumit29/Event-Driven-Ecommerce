import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:7000", {
  transports: ["websocket", "polling"],
});

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:7000/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchOrders();

    // Listen for updates
    socket.on("orders", (data) => {
      setOrders(data);
    });

    return () => socket.off("orders");
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span role="img" aria-label="cart">
          🛍️
        </span>{" "}
        Live Order Dashboard
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead style={{ backgroundColor: "#1e293b", color: "#fff" }}>
            <tr>
              <th style={{ padding: "1rem" }}>Order ID</th>
              <th>Customer</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                    color: "#64748b",
                  }}
                >
                  No orders yet...
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.orderId}
                  style={{
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e2e8f0",
                    color: "#000",
                  }}
                >
                  <td style={{ padding: "0.8rem" }}>{o.orderId}</td>
                  <td>{o.customerName}</td>
                  <td>₹{o.amount}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor:
                          o.status === "CREATED"
                            ? "#fbbf24"
                            : o.status === "SHIPPED"
                            ? "#22c55e"
                            : "#3b82f6",
                        color: "#000",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        padding: "0.3rem 0.6rem",
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "#475569",
          fontSize: "0.9rem",
        }}
      >
        Built with ❤️ by <b>Sukhman Singh</b> & <b>Jasmeet Singh</b>
      </footer>
    </div>
  );
}

export default App;
