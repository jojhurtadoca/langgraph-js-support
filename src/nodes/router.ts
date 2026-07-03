import { llm } from "../core/llm.js";
import { AgentState } from "../graph/state.js";

export const routerNode = async (state: AgentState) => {
    const lastMessage = state.messages[state.messages.length - 1].content;
    const prompt = `Categorize the following support ticket into 'billing', 'technical', or 'general': "${lastMessage}". Only output the word of the category.`;

    const response = await llm.invoke(prompt);
    const category = response.content.toString().toLowerCase().trim();
    const validCategories = ["billing", "technical", "general"];
    const finalCategory = validCategories.includes(category) ? category : "general";

    return { category: finalCategory as any };
};
