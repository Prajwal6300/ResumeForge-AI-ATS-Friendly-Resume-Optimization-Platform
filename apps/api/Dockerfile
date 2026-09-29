FROM python:3.12-slim

# Create non-root user
RUN groupadd --gid 1000 resumeforge && \
    useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home resumeforge

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app /app/app

# Switch to non-root user
USER resumeforge

# Create uploads directory with proper ownership for non-root user
RUN mkdir -p /app/uploads && chown resumeforge:resumeforge /app/uploads

# Expose the port the app runs on
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]