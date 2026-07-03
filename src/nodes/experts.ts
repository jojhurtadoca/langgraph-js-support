import { llm } from "../core/llm.js";
import { supportTools } from "../core/mcp-server.js";
import { AgentState } from "../graph/state.js";
import { ragService } from "../rag/engine.js";

const llmWithTools = llm.bindTools(supportTools);

export const billingExpert = async (state: AgentState) => {
    const lastMessage = state.messages[state.messages.length - 1].content as string;
    const context = await ragService.query(lastMessage);

    const response = await llmWithTools.invoke([
        {
            role: "system", content: `You are a Billing Specialist. Use the provided Context to answer. If the context doesn't contain the answer, you can use your tools if applicable.
        Context: ${context}`
        },
        ...state.messages
    ]);

    return { messages: [response] };
};

export const techExpert = async (state: AgentState) => {
    const lastMessage = state.messages[state.messages.length - 1].content as string;
    const context = await ragService.query(lastMessage);

    const response = await llmWithTools.invoke([
        {
            role: "system", content: `You are a Technical Support Engineer. Use the provided Context to answer. If the context doesn't contain the answer, use your tools (like reset_password or get_ticket_status).
        Context: ${context}`
        },
        ...state.messages
    ]);

    return { messages: [response] };
};

export const generalExpert = async (state: AgentState) => {
    const lastMessage = state.messages[state.messages.length - 1].content as string;
    const context = await ragService.query(lastMessage);

    const response = await llmWithTools.invoke([
        {
            role: "system", content: `You are a General Support Agent. Use the provided Context to answer. This context includes FAQs like the Return Policy.
        Context: ${context}`
        },
        ...state.messages
    ]);

    return { messages: [response] };
};
