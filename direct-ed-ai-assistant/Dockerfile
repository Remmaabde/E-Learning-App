# Use official PyTorch image with CUDA support preinstalled
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

# Set working directory
WORKDIR /app

# Avoid interactive prompts & improve pip stability
ENV DEBIAN_FRONTEND=noninteractive \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_RETRIES=10 \
    PIP_PROGRESS_BAR=off

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl wget build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for caching
COPY requirements.txt .

# ⚡ Skip torch/torchvision/torchaudio since base image has them
RUN pip install --no-cache-dir -r requirements.txt --timeout=1000 --retries=10

# Copy the rest of the project
COPY . .

# Expose FastAPI port
EXPOSE 7860

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
