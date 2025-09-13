require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Schema + Model
const busSchema = new mongoose.Schema({
  name: String,
  route: String,
  time: String,
  coords: [Number], // [lat, lng]
  occupancy: Number,
});
const Bus = mongoose.model("Bus", busSchema);

// REST API (optional for debugging)
app.get("/buses", async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// Socket.IO
io.on("connection", async (socket) => {
  console.log("🔗 Client connected:", socket.id);

  // Send initial bus data
  const buses = await Bus.find();
  socket.emit("busUpdate", buses);

  // Watch for DB changes (real-time MongoDB change streams)
  const changeStream = Bus.watch();
  changeStream.on("change", async () => {
    const updatedBuses = await Bus.find();
    io.emit("busUpdate", updatedBuses);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    changeStream.close();
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
