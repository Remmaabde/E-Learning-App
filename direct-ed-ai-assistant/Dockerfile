
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime


WORKDIR /app


ENV DEBIAN_FRONTEND=noninteractive \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_RETRIES=10 \
    PIP_PROGRESS_BAR=off

RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl wget build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt --timeout=1000 --retries=10

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
