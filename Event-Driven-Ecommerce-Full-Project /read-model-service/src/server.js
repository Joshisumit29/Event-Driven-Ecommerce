const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const cors = require("cors");

dotenv.config();
const app = express();

// ✅ Allow both local frontend ports
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Create HTTP + WebSocket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (Read Model Service)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define Order Model (use 'orders' collection explicitly)
const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerName: String,
    amount: Number,
    status: String,
    createdAt: Date,
  },
  { collection: "orders" }
);
const Order = mongoose.model("Order", orderSchema);

// ✅ REST endpoint to fetch all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ WebSocket connection for live updates
io.on("connection", (socket) => {
  console.log("🟢 Dashboard connected via WebSocket");

  // Send updated orders every 3 seconds
  const interval = setInterval(async () => {
    const orders = await Order.find().sort({ createdAt: -1 });
    socket.emit("orders", orders);
  }, 3000);

  socket.on("disconnect", () => {
    console.log("🔴 Dashboard disconnected");
    clearInterval(interval);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 7000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Read Model Service running on port ${PORT}`);
});
