import os
import json
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import APIKeyHeader
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.chains.router import (
    chat_chain_with_history,
    content_generation_chain,
)
from app.schemas.api_models import ChatInput

load_dotenv()
LOG_FILE = "app/analytics_log.jsonl"

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="DirectEd AI Assistant Server",
    version="1.0",
    description="A multi-functional API server for the DirectEd AI assistant.",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

API_KEY = os.getenv("BACKEND_SECRET_KEY")
API_KEY_NAME = "X-API-Key"
api_key_header_scheme = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def get_api_key(api_key_header: str = Depends(api_key_header_scheme)):
    if not api_key_header or api_key_header != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return api_key_header

allowed_origins = [
    "https://e-learning-app-delta.vercel.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_dependencies = [Depends(get_api_key)]

add_routes(
    app,
    chat_chain_with_history,
    path="/api/assistant/chat",
    dependencies=api_dependencies,
)

add_routes(
    app,
    content_generation_chain,
    path="/api/assistant/content/generate",
    dependencies=api_dependencies,
)


@app.get("/api/assistant/analytics", dependencies=api_dependencies)
@limiter.limit("10/minute")
async def get_analytics(request: Request):
    """Retrieves usage analytics from the log file."""
    if not os.path.exists(LOG_FILE):
        return {"status": "ok", "data": [], "message": "No analytics logged yet."}

    analytics_data = []
    with open(LOG_FILE, "r") as f:
        for line in f:
            analytics_data.append(json.loads(line))

    return {"status": "ok", "data": analytics_data}


@app.get("/")
@limiter.limit("60/minute")
async def read_root(request: Request):
    """Health check endpoint."""
    return {"status": "DirectEd AI Assistant is running"}
