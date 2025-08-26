import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import time

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()
print("✅ Environment variables loaded.")

SOURCES_CONFIG = [
    {
        "track": "Generative AI", "module": "Module 1: Python Recap, APIs, & AI Backend",
        "path": "app/data/gen_ai_track/module_1_python_apis_backend",
        "sources": [
            {"type": "local", "file_name": "1_python_recap.txt", "source_name": "DirectEd: Python Recap"},
            {"type": "local", "file_name": "2_intro_to_gen_ai.txt", "source_name": "DirectEd: Intro to Gen AI"},
            {"type": "local", "file_name": "3_intro_to_llms.txt", "source_name": "DirectEd: Intro to LLMs"},
            {"type": "local", "file_name": "4_intro_to_prompt_eng.txt", "source_name": "DirectEd: Intro to Prompt Engineering"},
            {"type": "local", "file_name": "5_ai_python_for_beginners.txt", "source_name": "DirectEd: AI Python For Beginners"},
            {"type": "local", "file_name": "6_what_is_an_api.txt", "source_name": "DirectEd: What is an API?"},
            {"type": "local", "file_name": "7_fastapi_basics.txt", "source_name": "DirectEd: FastAPI Basics"},
            {"type": "local", "file_name": "8_using_postman.txt", "source_name": "DirectEd: Using Postman"},
            {"type": "local", "file_name": "9_ai_backend_gemini_fastapi.txt", "source_name": "DirectEd: AI Backend with Gemini & FastAPI"},
            {"type": "local", "file_name": "10_git_collaboration.txt", "source_name": "DirectEd: Git Collaboration"},
            {"type": "pdf", "url": "https://file.notion.so/f/f/a953852c-d342-4227-95cb-26bc2e5e8e56/ff802771-623f-46e5-aa07-8d139f313f99/git-cheat-sheet-education_2.pdf?table=block&id=21b52c03-8379-8152-a17e-c2e364df7648&spaceId=a953852c-d342-4227-95cb-26bc2e5e8e56&expirationTimestamp=1756029600000&signature=BV6jUbqJwiUCwz7s65M403hcl33Yd0xFoetAzBIbuHw&downloadName=git-cheat-sheet-education_2.pdf", "file_name": "10a_git_cheatsheet.pdf", "source_name": "Git Cheat Sheet", "source_url": "https://file.notion.so/f/f/a953852c-d342-4227-95cb-26bc2e5e8e56/ff802771-623f-46e5-aa07-8d139f313f99/git-cheat-sheet-education_2.pdf"},
        ]
    },
    {
        "track": "Generative AI", "module": "Module 2: Generative AI Deep Dive",
        "path": "app/data/gen_ai_track/module_2_gen_ai_deep_dive",
        "sources": [
            {"type": "local", "file_name": "1_gen_ai_recap.txt", "source_name": "DirectEd: Gen AI Recap"},
            {"type": "pdf", "url": "https://file.notion.so/f/f/a953852c-d342-4227-95cb-26bc2e5e8e56/1df2f27c-6ef4-4c7d-b5d7-e329459951d4/big-book-generative-ai-databricks.pdf?table=block&id=22152c03-8379-818f-a565-c0c193c42dff&spaceId=a953852c-d342-4227-95cb-26bc2e5e8e56&expirationTimestamp=1756029600000&signature=K9IYpHkQvRuJX4Wb5LN7S7ywCcychZBfTjoUEqkmxBw&downloadName=big-book-generative-ai-databricks.pdf", "file_name": "1a_databricks_gen_ai_book.pdf", "source_name": "Databricks: Big Book of Gen AI", "source_url": "https://file.notion.so/f/f/a953852c-d342-4227-95cb-26bc2e5e8e56/1df2f27c-6ef4-4c7d-b5d7-e329459951d4/big-book-generative-ai-databricks.pdf"},
            {"type": "local", "file_name": "2_gen_ai_main_course.txt", "source_name": "DirectEd: Gen AI Main Course"},
        ]
    },
    {
        "track": "Generative AI", "module": "Module 3: Gen AI Essentials",
        "path": "app/data/gen_ai_track/module_3_gen_ai_essentials",
        "sources": [
            {"type": "local", "file_name": "1_gen_ai_essentials_main_course.txt", "source_name": "DirectEd: Gen AI Essentials Main Course"},
            {"type": "local", "file_name": "2_project_management.txt", "source_name": "DirectEd: Project Management"},
            {"type": "local", "file_name": "3_multi_agent_systems_crewai.txt", "source_name": "DirectEd: Multi-Agent Systems with CrewAI"},
        ]
    },
    {
        "track": "Generative AI", "module": "Module 4: LLMOps & Production-Grade Gen-AI Systems",
        "path": "app/data/gen_ai_track/module_4_llmops",
        "sources": [
            {"type": "local", "file_name": "1_llmops_fundamentals.txt", "source_name": "DirectEd: LLMOps Fundamentals"},
            {"type": "scrape", "url": "https://signoz.io/guides/llmops/", "file_name": "1a_signoz_llmops.txt", "selector": "article.prose", "source_name": "Signoz: LLMOps Guide", "source_url": "https://signoz.io/guides/llmops/"},
            {"type": "local", "file_name": "2_data_management_vector_db.txt", "source_name": "DirectEd: Data Management & Vector Databases"},
            {"type": "local", "file_name": "3_model_finetuning.txt", "source_name": "DirectEd: Model Fine-tuning & Development"},
        ]
    },
    {
        "track": "Full Stack", "module": "Module 1: Frontend Basics",
        "path": "app/data/full_stack_track/module_1_frontend_basics",
        "sources": [
            {"type": "local", "file_name": "1_internet_recap.txt", "source_name": "DirectEd: The Internet (Recap)"},
            {"type": "local", "file_name": "2_what_is_full_stack.txt", "source_name": "DirectEd: What is Full Stack?"},
            {"type": "local", "file_name": "3_html5.txt", "source_name": "DirectEd: HTML5"},
            {"type": "local", "file_name": "4_css3.txt", "source_name": "DirectEd: CSS3"},
            {"type": "local", "file_name": "5_tailwind.txt", "source_name": "DirectEd: Tailwind"},
            {"type": "local", "file_name": "6_intro_to_js.txt", "source_name": "DirectEd: Introduction to JavaScript"},
        ]
    },
    {
        "track": "Full Stack", "module": "Module 2: DOM, MERN, & React",
        "path": "app/data/full_stack_track/module_2_dom_mern_react",
        "sources": [
            {"type": "local", "file_name": "1_js_dom.txt", "source_name": "DirectEd: JavaScript DOM"},
            {"type": "pdf", "url": "https://drive.google.com/uc?export=download&id=1duftOF4EoT8g-u4M73V-JbxWYTddZGCY", "file_name": "1a_js_book.pdf", "source_name": "JavaScript Book", "source_url": "https://drive.google.com/file/d/1duftOF4EoT8g-u4M73V-JbxWYTddZGCY/view"},
            {"type": "pdf", "url": "https://drive.google.com/uc?export=download&id=1y3Hgtio5T3qnJDzp9TiN-sxjUIRL2KB-", "file_name": "1b_js_cheatsheet.pdf", "source_name": "JavaScript Cheat Sheet", "source_url": "https://drive.google.com/file/d/1y3Hgtio5T3qnJDzp9TiN-sxjUIRL2KB-/view"},
            {"type": "local", "file_name": "2_mern_dynamic_apps.txt", "source_name": "DirectEd: MERN & Dynamic Web Apps"},
            {"type": "scrape", "url": "https://www.mongodb.com/mern-stack", "file_name": "2a_mongodb_mern.txt", "selector": "main", "source_name": "MongoDB: MERN Stack", "source_url": "https://www.mongodb.com/mern-stack"},
            {"type": "local", "file_name": "3_intro_to_react.txt", "source_name": "DirectEd: Intro to React"},
            {"type": "pdf", "url": "https://drive.google.com/uc?export=download&id=1xlUs6mWfgJ-whUqYOVJv3M2de8oZMimu", "file_name": "3a_react_book.pdf", "source_name": "React Book", "source_url": "https://drive.google.com/file/d/1xlUs6mWfgJ-whUqYOVJv3M2de8oZMimu/view"},
            {"type": "pdf", "url": "https://drive.google.com/uc?export=download&id=1fb1uR5hAHWs5liRDNdsxP0pZXDiQJ1GE", "file_name": "3b_react_cheatsheet.pdf", "source_name": "React Cheat Sheet", "source_url": "https://drive.google.com/file/d/1fb1uR5hAHWs5liRDNdsxP0pZXDiQJ1GE/view"},
            {"type": "local", "file_name": "4_beginner_react.txt", "source_name": "DirectEd: Beginner React"},
            {"type": "local", "file_name": "5_intermediate_react.txt", "source_name": "DirectEd: Intermediate React"},
            {"type": "local", "file_name": "6_advanced_react.txt", "source_name": "DirectEd: Advanced React"},
        ]
    },
    {
        "track": "Full Stack", "module": "Module 3: Backend programming",
        "path": "app/data/full_stack_track/module_3_backend_programming",
        "sources": [
            {"type": "local", "file_name": "1_nodejs.txt", "source_name": "DirectEd: Server-Side Programming with Node.js"},
            {"type": "local", "file_name": "2_mysql.txt", "source_name": "DirectEd: Relational Databases with MySQL"},
            {"type": "local", "file_name": "3_mongodb.txt", "source_name": "DirectEd: Non-Relational Databases with MongoDB"},
            {"type": "local", "file_name": "4_express.txt", "source_name": "DirectEd: Express Framework"},
            {"type": "local", "file_name": "5_project_management.txt", "source_name": "DirectEd: Project Management"},
        ]
    },
    {
        "track": "Full Stack", "module": "Module 4: MERN + Typescript",
        "path": "app/data/full_stack_track/module_4_mern_typescript",
        "sources": [
            {"type": "local", "file_name": "1_intro_to_typescript.txt", "source_name": "DirectEd: Introduction To Typescript"},
            {"type": "local", "file_name": "2_beginner_ts_exercises.txt", "source_name": "DirectEd: Beginner Exercises on Typescript"},
            {"type": "local", "file_name": "3_react_with_ts_exercises.txt", "source_name": "DirectEd: Exercises on React with Typescript"},
            {"type": "local", "file_name": "4_solving_ts_errors.txt", "source_name": "DirectEd: Solving TypeScript Errors"},
            {"type": "local", "file_name": "5_building_mern_with_ts.txt", "source_name": "DirectEd: Building a MERN App with TypeScript"},
            {"type": "scrape", "url": "https://dev.to/raju_dandigam/smarter-javascript-in-2025-10-typescript-features-you-cant-ignore-5cf1?utm_source=chatgpt.com", "file_name": "6_typescript_features.txt", "selector": "article", "source_name": "Dev.to: TypeScript Features", "source_url": "https://dev.to/raju_dandigam/smarter-javascript-in-2025-10-typescript-features-you-cant-ignore-5cf1"},
        ]
    },
]

VECTOR_STORE_PATH = "app/vector_store"

print("Loading Google Generative AI embedding model 'models/embedding-001'...")
embedding_function = OpenAIEmbeddings(
    model="text-embedding-3-small"
)
vector_store = Chroma(persist_directory=VECTOR_STORE_PATH, embedding_function=embedding_function)
print("Setup complete. Database and OpenAI model are ready.")


def scrape_and_save(url: str, file_path: str, selector: str):
    """Scrape content from a URL using a simple requests call."""
    print(f"Scraping content from: {url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        content_element = soup.select_one(selector)
        if not content_element:
            print(f"Unable to locate content with selector '{selector}'. Skipping.")
            return
        text = content_element.get_text(separator="\n", strip=True)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved {os.path.getsize(file_path)} bytes to {file_path}")
    except Exception as e:
        print(f"Scraping failed for {url}: {e}. Skipping.")

def download_and_save_pdf(url: str, file_path: str):
    """Download a PDF from a URL and save it locally."""
    print(f"Downloading PDF from: {url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved PDF to {file_path}")
    except Exception as e:
        print(f"PDF download failed for {url}: {e}. Skipping.")

def process_document(path: str, metadata: dict):
    """Loads, splits, and embeds a single document into the vector store."""
    print(f"\n Processing file: {os.path.basename(path)}")
    try:
        if path.endswith(".pdf"):
            loader = PyPDFLoader(path)
        elif path.endswith(".txt"):
            loader = TextLoader(path, encoding="utf-8")
        else:
            return 

        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(docs)
        if not chunks:
            print("No text chunks found—skipping")
            return

        for c in chunks:
            c.metadata.update(metadata)

        ids = [f"{path}__{i}" for i in range(len(chunks))]
        vector_store.add_documents(documents=chunks, ids=ids)
        print(f"Processed {len(chunks)} chunks and updated vector store.")
    except Exception as e:
        print(f"Failed to process {os.path.basename(path)}: {e}")

def main():
    """Iterate through the config, acquire data, and process all files, including untracked ones."""
    
    print("\n---  Acquiring Configured Data ---")
    managed_files = set()
    for config in SOURCES_CONFIG:
        module_path = config["path"]
        for source in config["sources"]:
            file_path = os.path.join(module_path, source["file_name"])
            managed_files.add(os.path.abspath(file_path))
            if not os.path.exists(file_path):
                if source["type"] == "scrape":
                    scrape_and_save(source["url"], file_path, source["selector"])
                elif source["type"] == "pdf":
                    download_and_save_pdf(source["url"], file_path)

    print("\n--- Processing and Embedding All Documents ---")
    
    print("\n--- Processing Configured Files ---")
    for config in SOURCES_CONFIG:
        module_path = config["path"]
        print(f"\n--- Module: {config['module']} ---")
        if not os.path.exists(module_path):
            print(f"Directory not found: {module_path}. Skipping.")
            continue
        for source_info in config["sources"]:
            path = os.path.join(module_path, source_info["file_name"])
            if os.path.exists(path):
                metadata = {
                    "source_name": source_info["source_name"],
                    "source_url": source_info.get("source_url"),
                    "track": config["track"],
                    "module": config["module"],
                }
                process_document(path, metadata)
                time.sleep(1)

    print("\n--- Processing Un-configured Files ---")
    for root, dirs, files in os.walk("app/data"):
        for fname in files:
            path = os.path.join(root, fname)
            if os.path.abspath(path) not in managed_files:
                path_parts = path.split(os.sep)
                metadata = {
                    "source_name": os.path.splitext(fname)[0].replace("_", " ").title(),
                    "track": (
                        path_parts[2].replace("_", " ").title()
                        if len(path_parts) > 2
                        else "Unknown Track"
                    ),
                    "module": (
                        path_parts[3].replace("_", " ").title()
                        if len(path_parts) > 3
                        else "Unknown Module"
                    ),
                }
                process_document(path, metadata)
                time.sleep(1)

    print("\n Ingestion complete — knowledge base updated.")

if __name__ == "__main__":
    main()
