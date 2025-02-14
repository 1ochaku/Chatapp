import WebSocket, { WebSocketServer } from "ws";

export const initWebSocket = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket) => {
        console.log("New WebSocket connection");

        ws.on("message", (message: string) => {
            console.log("Received:", message.toString());
            ws.send(`Server Reply: ${message.toString()}`); // Echo back with a reply
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });

        ws.on("error", (err) => {
            console.error("WebSocket error:", err);
        });
    });

    console.log("WebSocket server initialized");
};
