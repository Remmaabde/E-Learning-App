from dotenv import load_dotenv

load_dotenv()

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.llms.custom import CustomChatModel
from langchain_openai import ChatOpenAI
from langchain_core.runnables import (
    RunnableBranch,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import get_buffer_string
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

from app.schemas.api_models import ChatInput, ChatOutput
from app.prompts.templates import (
    rag_prompt,
    quiz_generator_prompt,
    flashcard_generator_prompt,
    condense_question_prompt,
)

vector_store = Chroma(
    persist_directory="app/vector_store",
    embedding_function=HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2"),
)
openai_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.1)
finetuned_llm = CustomChatModel(
    api_url="https://nutnell-directed-ai.hf.space/generate"
).with_fallbacks([openai_llm])


def format_docs(docs):
    return "\n---\n".join(doc.page_content for doc in docs)


def get_sources_from_docs(docs):
    return [
        {
            "source": doc.metadata.get("source_url"),
            "name": doc.metadata.get("source_name"),
        }
        for doc in docs
    ]


memories = {}


def get_memory_for_session(session_id: str):
    if session_id not in memories:
        memories[session_id] = ChatMessageHistory()
    return memories[session_id]

def EducationalRetriever():
    """Component 1: Identifies relevant curriculum content."""
    return vector_store.as_retriever(search_kwargs={"k": 5})


def AdaptiveConversationChain():
    """Component 2: Produces personalized explanations using structured prompts and context."""
    retriever = EducationalRetriever()
    condense_question_chain = (
        RunnableLambda(
            lambda x: {
                "question": x["input"],
                "chat_history": get_buffer_string(x["chat_history"]),
            }
        )
        | condense_question_prompt
        | openai_llm
        | StrOutputParser()
    )
    return RunnablePassthrough.assign(
        standalone_question=condense_question_chain
    ).assign(
        context=lambda x: retriever.invoke(x["standalone_question"])
    ) | RunnableParallel(
        answer=(
            RunnableLambda(
                lambda x: {
                    "context": format_docs(x["context"]),
                    "question": x["input"],
                    "subject": x.get("subject", "the topic"),
                    "difficulty_level": x.get("difficulty_level", "beginner"),
                }
            )
            | rag_prompt
            | finetuned_llm
            | StrOutputParser()
        ),
        sources=RunnableLambda(lambda x: get_sources_from_docs(x["context"])),
    )


def ContentGenerator():
    """Component 3: Creates practice questions, flashcards, and assessments."""
    retriever = EducationalRetriever()

    QuizGenerationChain = RunnablePassthrough.assign(
        context=lambda x: retriever.invoke(x["input"])
    ) | RunnableParallel(
        answer=(
            RunnableLambda(
                lambda x: {
                    "context": format_docs(x["context"]),
                    "subject": x.get("subject", "the provided topic"),
                    "difficulty_level": x.get("difficulty_level", "intermediate"),
                }
            )
            | quiz_generator_prompt
            | finetuned_llm
            | StrOutputParser()
        ),
        sources=RunnableLambda(lambda x: get_sources_from_docs(x["context"])),
    )


    FlashcardGenerationChain = (
        RunnablePassthrough.assign(context=lambda x: retriever.invoke(x["input"]))
        | RunnableLambda(
            lambda x: {
                "context": format_docs(x["context"]),
                "difficulty_level": x.get(
                    "difficulty_level", "beginner"
                ),
            }
        )
        | flashcard_generator_prompt
        | finetuned_llm
        | StrOutputParser()
    )

    return RunnableBranch(
        (lambda x: x.get("request_type") == "quiz_generation", QuizGenerationChain),
        (
            lambda x: x.get("request_type") == "flashcard_creation",
            FlashcardGenerationChain,
        ),
        RunnableLambda(
            lambda x: {"answer": "Unknown content type requested.", "sources": []}
        ),
    )


def LearningAnalyzer():
    """Component 4: Monitors user engagement and adapts response approaches (I'll revisit this later)."""

    def analyze(input_data):
        print("LOG: LearningAnalyzer executed. User input:", input_data.get("input"))

        return input_data

    return RunnableLambda(analyze)

def run_educational_assistant():
    """Central function that invokes components based on user requests."""
    return RunnableBranch(
        (lambda x: x.get("request_type") == "tutoring", AdaptiveConversationChain()),
        ContentGenerator(),
    )


educational_assistant_chain = run_educational_assistant() | LearningAnalyzer()

chat_chain_with_history = RunnableWithMessageHistory(
    educational_assistant_chain,
    get_memory_for_session,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
).with_types(
    input_type=ChatInput, output_type=ChatOutput
)


content_generation_chain = (ContentGenerator() | LearningAnalyzer()).with_types(
    input_type=ChatInput, output_type=ChatOutput
)
