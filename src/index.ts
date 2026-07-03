import * as dotenv from "dotenv";
dotenv.config();

import { HumanMessage } from "@langchain/core/messages";
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { createSupportGraph } from "./graph/builder.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 3700;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const graph = createSupportGraph();

io.on("connection", (socket: any) => {
    console.log("Client connected:", socket.id);

    socket.on("chat message", async (message: string) => {
        try {
            const inputs = {
                messages: [new HumanMessage(message)],
            };

            // Use socket ID as thread_id for stateful persistence
            const config = { configurable: { thread_id: socket.id } };

            // Invoke graph with configuration to enable checkpointer memory
            const result = await graph.invoke(inputs, config);
            const lastMsg = result.messages[result.messages.length - 1];

            socket.emit("bot response", {
                reply: lastMsg.content,
                category: result.category
            });
        } catch (error) {
            console.error("Error in LangGraph:", error);
            socket.emit("bot response", { error: "Internal server error" });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(port, () => {
    console.log(`Chatbot server running at http://localhost:${port}`);
});
