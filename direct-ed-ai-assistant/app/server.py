import os
from fastapi import FastAPI, Depends, HTTPException, status

from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.chains.router import educational_assistant_chain, chat_chain_with_history, content_generation_chain
from app.schemas.api_models import ChatInput

load_dotenv()

app = FastAPI(
    title="DirectEd AI Assistant Server",
    version="1.0",
    description="A multi-functional API server for the DirectEd AI assistant.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
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
    """Placeholder endpoint for retrieving usage analytics."""
    return {"status": "ok", "message": "Analytics endpoint is under development."}


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "DirectEd AI Assistant is running"}


