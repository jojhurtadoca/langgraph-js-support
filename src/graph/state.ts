import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const SupportStateAnnotation = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    category: Annotation<"billing" | "technical" | "general" | "">({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
});

export type AgentState = typeof SupportStateAnnotation.State;
