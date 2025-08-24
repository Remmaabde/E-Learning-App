# DirectEd AI Assistant Backend

This repository contains the backend services for the DirectEd AI Assistant, a sophisticated RAG (Retrieval-Augmented Generation) chatbot designed to provide expert, curriculum-aware tutoring. The assistant is powered by a custom fine-tuned model with a GPT-3.5 fallback and is served via a secure, production-ready FastAPI application.

## Features

-   **Multi-Modal Knowledge Base:**
 Ingests knowledge from local text files, PDFs, and web pages.

-   **Conversational Tutoring:** 
Engages in dialogue to answer questions based on the curated knowledge base, with support for chat history.

-   **Adaptive Content Generation:**
Creates quizzes and flashcards tailored to a user's specified difficulty level and subject.

-   **Component-Based Architecture:** 
Built with a modular design featuring distinct components for retrieval, conversation, content generation, and analysis.

-   **Hybrid Model Approach:** 
Uses a custom fine-tuned model as the primary LLM, with a seamless fallback to GPT-3.5 for enhanced reliability.

-   **Secure & Documented API:** 
All endpoints are protected via API key authentication and are self-documenting through Swagger UI.

-   **Production-Ready:** 
Containerized with a multi-stage Dockerfile for efficient and secure deployment.

## Tech Stack

-   **AI Orchestration:** 
 LangChain & LangServe

-   **LLMs:**
 Custom Fine-Tuned Model (primary), GPT-3.5-turbo (fallback)

-   **Knowledge Base:**
 ChromaDB

-   **API Framework:**
 FastAPI

-   **Data Ingestion:** 
PyPDF, BeautifulSoup4

-   **Deployment:**
 Docker

---

## Local Setup & Development

### Prerequisites
-   Python 3.11+
-   Git
-   Docker Desktop

### 1. Clone the Repository
```bash
git clone [https://github.com/Remmaabde/E-Learning-App.git](https://github.com/Remmaabde/E-Learning-App.git)
```
```bash
cd direct-ed-ai-assistant
```

### 2. Configure Environment Variables
Create a `.env` file in the project root. This file is ignored by Git and should contain your secret keys.

```env
# Required by LangChain for the OpenAI fallback model
OPENAI_API_KEY="sk-..."

# A secret key you create to protect your FastAPI server from unauthorized access
BACKEND_SECRET_KEY="your-strong-secret-key-12345"

# Enables automatic, detailed logging of all AI chains to your LangSmith project
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_API_KEY="ls__..."
LANGCHAIN_PROJECT="DirectEd AI Assistant"
```

### 3. Install Dependencies
It is highly recommended to use a Python virtual environment.

```bash
conda create -name direct-ed-ai python=3.13.5 -y
```
```bash
source venv/bin/activate
```
```bash 
pip install -r requirements.txt
```

### 4. Build the Knowledge Base
The ingestion script will download external resources (PDFs, web pages) and process all local and acquired files into the ChromaDB vector store.

**Before running:**
-   Create all the necessary empty `.txt` files inside the `app/data/` subdirectories as specified in the configuration.
-   Fill these files with the curriculum content from your relevant pages.

**Run the script:**
```bash
python ingest_data.py
```
This command is safe to re-run. It will not re-download existing files or create duplicate entries in the database.

### 5. Run the Server Locally
Start the development server using Uvicorn.

```bash
uvicorn app.server:app --host 127.0.0.1 --port 8000 --reload
```
The API will be available at `http://127.0.0.1:8000`, and the interactive Swagger UI documentation can be accessed at `http://127.0.0.1:8000/docs`.

---

## API Documentation

### Authentication
All API endpoints are protected. Requests must include your secret key in the `X-API-Key` header.

-   **Header:** `X-API-Key: your-strong-secret-key-12345`

### Endpoint 1: Conversational Chat
This is the main stateful endpoint for conversational tutoring. It manages and remembers chat history for each user session.

-   **URL:** `/api/assistant/chat/invoke`
-   **Method:** `POST`

#### Example Request (Tutoring)
```bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/api/assistant/chat/invoke](http://127.0.0.1:8000/api/assistant/chat/invoke)' \
  -H 'accept: application/json' \
  -H 'X-API-Key: your-strong-secret-key-12345' \
  -H 'Content-Type: application/json' \
  -d '{
  "input": {
    "input": "What is the difference between MLOps and LLMOps?",
    "user_type": "student",
    "request_type": "tutoring",
    "subject": "LLMOps Fundamentals",
    "difficulty_level": "beginner"
  },
  "config": {
    "configurable": {
      "session_id": "user-session-uuid-1234"
    }
  }
}
```

### Endpoint 2: Quick Actions (Content Generation)
This is a stateless endpoint for one-off content generation tasks like creating quizzes or flashcards. It does not use chat history.

-   **URL:** `/api/assistant/content/generate/invoke`
-   **Method:** `POST`

#### Example Request (Quiz Generation)
```bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/api/assistant/content/generate/invoke](http://127.0.0.1:8000/api/assistant/content/generate/invoke)' \
  -H 'accept: application/json' \
  -H 'X-API-Key: your-strong-secret-key-12345' \
  -H 'Content-Type: application/json' \
  -d '{
  "input": {
    "input": "The key stages of the LLMOps Lifecycle",
    "user_type": "instructor",
    "request_type": "quiz_generation",
    "subject": "LLMOps Fundamentals",
    "difficulty_level": "intermediate"
  }
}'
```

### Response Schema (for all endpoints)
A successful request will return a JSON object with the following structure:

```json
{
  "output": {
    "answer": "The AI-generated response text...",
    "sources": [
      {
        "source": "[https://source-url.com](https://source-url.com)",
        "name": "Source Document Name"
      }
    ]
  },
  "metadata": {
    "run_id": "a-unique-run-id-from-langsmith",
    "feedback_tokens": []
  }
}
```

---

## Containerization & Deployment

### 1. Build the Docker Image
The project includes a multi-stage `Dockerfile` that first builds the knowledge base and then creates a lean production image with only the necessary runtime dependencies.

From the project root, run:
```bash
docker build -t direct-ed-ai-assistant .
```

### 2. Run the Container Locally
To test the image locally, run the following command. This maps port 8000 and securely passes your environment variables to the container.

```bash
docker run -p 8000:8000 \
  -e OPENAI_API_KEY="sk-..." \
  -e BACKEND_SECRET_KEY="your-strong-secret-key-12345" \
  -e LANGCHAIN_TRACING_V2="true" \
  -e LANGCHAIN_API_KEY="ls__..." \
  -e LANGCHAIN_PROJECT="DirectEd AI Assistant" \
  direct-ed-ai-assistant
```

### 3. Deploy to a Registry and Host
For production, you should push your image to a container registry and deploy it from there.

1.  **Tag the image:**
    ```bash
    docker tag direct-ed-ai-assistant my-dockerhub-username/direct-ed-ai-assistant:latest
    ```
2.  **Push to Docker Hub:**
    ```bash
    docker push my-dockerhub-username/direct-ed-ai-assistant:latest
    ```
3.  **Deploy on a Host (e.g., Render):**
    -   Create a new "Web Service" on Render.
    -   Select "Deploy an existing image" and provide the image path (e.g., `my-dockerhub-username/direct-ed-ai-assistant`).
    -   In the "Environment" tab, add all the secret keys from your `.env` file.
    -   Deploy the service.
