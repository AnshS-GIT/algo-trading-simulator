import{ useEffect, useRef, useState } from "react";

export default function useWebSocket() {
  const wsRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    function connect() {
      wsRef.current = new WebSocket("wss://algo-trading-simulator.onrender.com");

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setData(message);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        setTimeout(connect, 1000);
      };
    }

    connect();
  }, []);

  function send(msg) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }

  return { data, send };
}
