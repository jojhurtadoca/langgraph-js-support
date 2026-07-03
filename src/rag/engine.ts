import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as dotenv from "dotenv";

dotenv.config();

export class RAGService {
    private vectorStore: MemoryVectorStore | null = null;
    private embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: "sentence-transformers/all-miniLM-L6-v2",
    });

    async indexKnowledge(texts: string[]) {
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
        const docs = await splitter.createDocuments(texts);
        this.vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
    }

    async query(text: string) {
        if (!this.vectorStore) return "No knowledge base indexed.";
        const results = await this.vectorStore.similaritySearch(text, 2);
        return results.map((r: any) => r.pageContent).join("\n");
    }
}

export const ragService = new RAGService();

// Initialize with some support FAQs
ragService.indexKnowledge([
    "Our return policy allows returns within 30 days of purchase with a valid receipt.",
    "Refunds are processed within 10-14 business days once the item is received at our warehouse.",
    "Items must be in original packaging and unused to qualify for a full refund.",
    "To reset your password, go to settings > security on our main portal.",
    "Billed cycles start on the 1st of every month automatically.",
    "Technical support is available 24/7 via the 'Help' button in the app.",
    "To cancel a subscription, visit the billing portal or contact billing specialists.",
    "Warranties cover manufacturing defects but not accidental damage."
]).catch(console.error);
