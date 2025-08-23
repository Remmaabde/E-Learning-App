from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class ChatInput(BaseModel):
    input: str = Field(
        ...,
        description="The user's question or the topic for content generation.",
        examples=["What is the difference between MLOps and LLMOps?"]
    )
    user_type: Literal["student", "instructor"] = Field(
        ...,
        description="The type of user making the request.",
        examples=["student"]
    )
    request_type: Literal["tutoring", "quiz_generation", "flashcard_creation"] = Field( # <-- ADD flashcard_creation
        ...,
        description="The type of request, e.g., a tutoring question or a request to generate content.",
        examples=["quiz_generation"]
    )
    
    subject: Optional[str] = Field(
        None, 
        description="The subject or topic, can be used for filtering or context.",
        examples=["LLMOps Fundamentals"]
    )
    difficulty_level: Optional[Literal["beginner", "intermediate", "advanced"]] = Field(
        None, 
        description="The desired difficulty level for the response or content.",
        examples=["beginner"]
    )

class Source(BaseModel):
    source: str = Field(..., description="The URL of the source document.")
    name: str = Field(..., description="The name of the source (e.g., 'DirectEd Curriculum').")