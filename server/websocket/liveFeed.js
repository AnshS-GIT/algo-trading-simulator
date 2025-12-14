import WebSocket, { WebSocketServer } from "ws";

let currentSymbol = "AAPL";
let currentPrice = 100;

function startWebSocketServer(server) {
  const wss = new WebSocketServer({ port: 4000 });

  console.log("WebSocket Server running on port 4000");

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      if (data.type === "change_symbol") {
        currentSymbol = data.symbol;
        currentPrice = 100; // reset
        console.log("Switching to symbol:", currentSymbol);
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });

  // BROADCAST EVERY SECOND
  setInterval(() => {
    currentPrice += (Math.random() - 0.5) * 0.8;

    const candle = {
      symbol: currentSymbol,
      price: Number(currentPrice.toFixed(2)),
      open: Number((currentPrice - 0.3).toFixed(2)),
      high: Number((currentPrice + 0.5).toFixed(2)),
      low: Number((currentPrice - 0.7).toFixed(2)),
      close: Number(currentPrice.toFixed(2)),
      timestamp: Date.now(),
    };

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(candle));
      }
    });
  }, 1000);
}

export { startWebSocketServer };

