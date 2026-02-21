FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  build-essential \
  libpq-dev \
  gcc \
  python3-dev \
  && rm -rf /var/lib/apt/lists/* \
  && pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files during image build so WhiteNoise has files at runtime
RUN python manage.py collectstatic --noinput || true

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8080"]