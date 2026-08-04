FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Shell form (not JSON-array) so $PORT actually expands. Railway injects PORT
# dynamically at runtime; ${PORT:-8000} falls back to 8000 for local/Compose
# use where PORT isn't set. The JSON-array form used previously
# (CMD ["uvicorn", ..., "--port", "8000"]) does NOT expand environment
# variables at all, so it silently ignored Railway's assigned port — this
# was very likely why the deployed backend was unreachable.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
