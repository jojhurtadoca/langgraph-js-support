import { END, MemorySaver, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { supportTools } from "../core/mcp-server.js";
import { billingExpert, generalExpert, techExpert } from "../nodes/experts.js";
import { routerNode } from "../nodes/router.js";
import { AgentState, SupportStateAnnotation } from "./state.js";

function routeByCategory(state: AgentState) {
    if (state.category === "billing") return "billingExpert";
    if (state.category === "technical") return "techExpert";
    return "generalExpert";
}

function shouldContinue(state: AgentState) {
    const lastMessage = state.messages[state.messages.length - 1];
    if ((lastMessage as any).tool_calls?.length > 0) {
        return "tools";
    }
    return END;
}

const checkpointer = new MemorySaver();
const toolNode = new ToolNode(supportTools);

export const createSupportGraph = () => {
    return new StateGraph(SupportStateAnnotation)
        .addNode("router", routerNode)
        .addNode("billingExpert", billingExpert)
        .addNode("techExpert", techExpert)
        .addNode("generalExpert", generalExpert)
        .addNode("tools", toolNode)
        .setEntryPoint("router")
        .addConditionalEdges("router", routeByCategory)
        .addConditionalEdges("billingExpert", shouldContinue)
        .addConditionalEdges("techExpert", shouldContinue)
        .addConditionalEdges("generalExpert", shouldContinue)
        .addEdge("tools", "generalExpert") // Return to general or specific if needed, but general works for follow-up
        .compile({ checkpointer });
};
