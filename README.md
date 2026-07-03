# Customer Support Agent (Express + HTML UX)

A real-time intelligent chatbot that uses a **Stateful Graph Architecture** for ticket routing and resolution.

*Project created in May 2026.*

## Architecture & Patterns
- **Directed Acyclic Graph (DAG)**: Orchestration of support logic using defined nodes and edges.
- **Stateful Persistence (MemorySaver)**: Implemented conversation memory using a checkpointer. The chatbot retains context within the same session using `thread_id`.
- **Real-time UX/UI**: Webhook-based integration with a modern HTML5/CSS3 frontend via Socket.io.

## Tech Stack
- **Express.js**: Web server with Socket.io for real-time events.
- **LangGraph.js**: Graph-based agentic workflow.
- **LangChain.js**: Unified LLM interface.
- **Groq**: Llama-3.3-70b for high-speed categorization.
- **LangSmith**: Real-time monitoring and observability for the agent graph.
- **RAG Customer Support**: Features a specialized Node.js vector engine using `@langchain/classic` for answering based on company FAQs.
- **MCP Server (Typed)**: A Model Context Protocol server integrated for secure tool-use. Handles `reset-user-password`, `get-ticket-status`, `check-warranty`, and `calculate-shipping`.

## How to Use
1. **Configure environment**: Create a `.env` file with `GROQ_API_KEY`, `HUGGINGFACE_API_KEY`, and `LANGSMITH_API_KEY`.
2. **Start the Chatbot**:
   ```bash
   npm start
   ```
3. **Access the UI**:
   Open your browser at `http://localhost:3100` (or the configured `PORT`).
3. **Interact**:
   Type a request like *"My credit card was charged twice"* or *"How do I configure my router?"*.
   *   The **Router** will send billing queries to the **Billing Expert** and technical ones to the **Tech Expert**.
   *   The chatbot has **Memory**, so it will remember your previous messages during the session.

## Testing RAG & MCP
- **RAG (FAQ Retrieval)**:
  - Ask: *"What is your return policy?"*.
  - The agent will retrieve answers from the FAISS/Local vector store using HuggingFace embeddings.
- **MCP (Support Tools)**:
  - Ask: *"What is the status of ticket T-505?"* (Calls `get-ticket-status`).
  - Ask: *"Reset password for user test@example.com"* (Calls `reset-user-password`).
  - Ask: *"Is my product from 2022 still covered?"* (Calls `check-warranty`).

## To-Do
- [ ] **Urgency**: Add an "Urgent" detector node that flags tickets for human intervention.
- [ ] **Database**: Implement a node to save the categorized ticket to a database.
- [ ] **Sentiment**: Add a sentiment analysis step to the router.
- [ ] **WebSockets**: Transition from HTTP polling to WebSockets for real-time chat updates.

## Setup
1. Install:
   ```bash
   npm install or npm install --legacy-peer-deps
   ```
2. Configure `.env` with `GROQ_API_KEY` and `HUGGINGFACE_API_KEY`.
   - **Hugging Face Token Setup**:
     - Go to [Hugging Face Settings > Tokens](https://huggingface.co/settings/tokens).
     - Create a **Fine-grained Token** (recommended) or a classic token.
     - **Required Permissions**: Under the **Inference** scope, ensure **"Make calls to Inference Providers"** and **"Make calls to your Inference Endpoints"** are checked.
     - Copy the token and add it to your `.env`: `HUGGINGFACE_API_KEY=hf_...`
3. Run:
   ```bash
   npm start
   ```
