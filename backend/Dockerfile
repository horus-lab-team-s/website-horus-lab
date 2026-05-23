# Image du backend Django (API REST Horus-Lab)
FROM python:3.13-slim

# - PYTHONUNBUFFERED : logs en direct
# - PYTHONDONTWRITEBYTECODE : pas de fichiers .pyc
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# psycopg[binary] et Pillow embarquent leurs libs -> pas de paquet système requis.
COPY requirements.txt .
# --retries/--timeout : robustesse face à un réseau instable pendant le build.
RUN pip install --retries 10 --timeout 120 -r requirements.txt

COPY . .

# Au cas où le script aurait des fins de ligne Windows (CRLF) : on les retire,
# puis on le rend exécutable.
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
