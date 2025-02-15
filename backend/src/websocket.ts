import WebSocket, { WebSocketServer } from "ws";

export const initWebSocket = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket) => {
        console.log("New WebSocket connection");

        // ws.on("message", (message: string) => {
        //     console.log("Received:", message.toString());
        //     ws.send(`Server Reply: ${message.toString()}`); // Echo back with a reply
        // });

        // !!!!!!!!!!!1
        // ws.on("message", (message: string) => {
        //     const receivedData = JSON.parse(message);
        //     console.log(receivedData.session); // "123"
        //     console.log(receivedData.message); // "Hello"
        // });

        // !!!!!!!!!!!!!!!2
        ws.on("message", (message: string) => {
            const receivedData = JSON.parse(message);
            
            console.log(receivedData.session); // "123"
            console.log(receivedData.message); // "Hello"

            // Construct the response in { session, reply } format
            const response = {
                session: receivedData.session,
                reply: receivedData.message, // Echo back the message as a reply
            };

            // Send the response back to the client
            ws.send(JSON.stringify(response));
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
