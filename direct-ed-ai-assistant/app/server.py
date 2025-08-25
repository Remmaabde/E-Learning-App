import os
from fastapi import FastAPI, Depends, HTTPException, status
import json

from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.chains.router import (
    educational_assistant_chain,
    chat_chain_with_history,
    content_generation_chain,
)
from app.schemas.api_models import ChatInput

load_dotenv()
LOG_FILE = "app/analytics_log.jsonl"

app = FastAPI(
    title="DirectEd AI Assistant Server",
    version="1.0",
    description="A multi-functional API server for the DirectEd AI assistant.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


add_routes(
    app,
    chat_chain_with_history,
    path="/api/assistant/chat",
)

add_routes(
    app,
    content_generation_chain,
    path="/api/assistant/content/generate",
)


@app.get("/api/assistant/analytics")
def get_analytics():
    """Retrieves usage analytics from the log file."""
    if not os.path.exists(LOG_FILE):
        return {"status": "ok", "data": [], "message": "No analytics logged yet."}

    analytics_data = []
    with open(LOG_FILE, "r") as f:
        for line in f:
            analytics_data.append(json.loads(line))

    return {"status": "ok", "data": analytics_data}


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "DirectEd AI Assistant is running"}
