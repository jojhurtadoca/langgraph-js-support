import { DynamicStructuredTool } from "@langchain/core/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const server = new McpServer({
    name: "SupportTools",
    version: "1.0.0"
});

// Implementation functions to avoid duplication
const resetPasswordImpl = async ({ email }: { email: string }) => {
    return `SUCCESS: Password reset link sent to ${email} via mock CRM.`;
};

const getTicketStatusImpl = async ({ ticketId }: { ticketId: string }) => {
    return `Ticket ${ticketId} status: IN_PROGRESS. Assigned to agent: Alex (System Mock).`;
};

const checkWarrantyImpl = async ({ productId, purchaseDate }: { productId: string, purchaseDate: string }) => {
    return `Product ${productId} purchased on ${purchaseDate} is COVERED by warranty until 2027-01-01.`;
};

// Register in MCP Server
server.registerTool(
    "reset_user_password",
    {
        description: "Resets a user password in the mock CRM. MUST be used when the user asks to reset a password.",
        inputSchema: { email: z.string().describe("The user email address") }
    },
    async (args: any) => ({
        content: [{ type: "text", text: await resetPasswordImpl(args) }]
    })
);

server.registerTool(
    "get_ticket_status",
    {
        description: "Retrieves the status of a support ticket. MUST be used when a ticket ID (like T-XXX) is provided.",
        inputSchema: { ticketId: z.string() }
    },
    async (args: any) => ({
        content: [{ type: "text", text: await getTicketStatusImpl(args) }]
    })
);

server.registerTool(
    "check_warranty",
    {
        description: "Checks if a product is still under warranty.",
        inputSchema: { productId: z.string(), purchaseDate: z.string() }
    },
    async (args: any) => ({
        content: [{ type: "text", text: await checkWarrantyImpl(args) }]
    })
);

// Export as LangChain tools for the Graph to use locally
export const supportTools = [
    new DynamicStructuredTool({
        name: "reset_user_password",
        description: "Resets a user password in the mock CRM. Provide the user email.",
        schema: z.object({ email: z.string().describe("The user email address") }),
        func: resetPasswordImpl,
    }),
    new DynamicStructuredTool({
        name: "get_ticket_status",
        description: "Retrieves the status of a support ticket.",
        schema: z.object({ ticketId: z.string() }),
        func: getTicketStatusImpl,
    }),
    new DynamicStructuredTool({
        name: "check_warranty",
        description: "Checks if a product is still under warranty.",
        schema: z.object({ productId: z.string(), purchaseDate: z.string() }),
        func: checkWarrantyImpl,
    }),
];

export const startMcpServer = async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server started on stdio");
};
