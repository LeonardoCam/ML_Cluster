# Usa una versión estable de postgres
FROM postgres:15

# instalar herramientas necesarias para compilar pgvector
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    ca-certificates \
    postgresql-server-dev-15 \
 && rm -rf /var/lib/apt/lists/*

# clonar y compilar pgvector
RUN git clone https://github.com/pgvector/pgvector.git /tmp/pgvector \
 && cd /tmp/pgvector \
 && make PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config \
 && make install PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config \
 && rm -rf /tmp/pgvector

# Exponer puerto y mantener CMD del postgres base
