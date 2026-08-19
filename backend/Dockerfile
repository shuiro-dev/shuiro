FROM ubuntu:24.04@sha256:33ceb71981b602c1a7443a53469e4dba065f7503eab3078a2d7a57a2ab987517 AS base
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
USER appuser
WORKDIR /home/appuser
ENV MISE_ROOT="/home/appuser/.local/share/mise"
ENV PATH="/home/appuser/.local/bin:${MISE_ROOT}/shims:${MISE_ROOT}/bin:${PATH}"
RUN curl https://mise.run | bash && \
    echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
WORKDIR /app
COPY --chown=appuser:appuser .tool-versions ./
RUN . ~/.bashrc && mise install

FROM base AS build
WORKDIR /app
USER root
RUN mkdir -p /app/node_modules \
    /app/backend/node_modules \
    /app/frontend/node_modules \
    /app/generated/openapi/node_modules \
    /app/backend/prisma/data && \
    chown -R appuser:appuser /app
COPY --chown=appuser:appuser . .
USER appuser
RUN . ~/.bashrc \
    && bun install --no-install-scripts
USER appuser
WORKDIR /app/backend
RUN bun prisma generate
ENV DATABASE_URL=file:/app/backend/prisma/data/deploy.db
RUN touch prisma/data/deploy.db && \
    bun prisma migrate deploy && \
    bun build --compile src/index.ts --outfile ./app
USER root
RUN mkdir -p /tmp/prod/app/node_modules/.prisma/client \
    /tmp/prod/app/prisma/data \
    /tmp/prod/node_modules/pyodide && \
    mv app /tmp/prod/app/ && \
    mv prisma/data/deploy.db /tmp/prod/app/prisma/data/ && \
    cp -r /app/node_modules/@prisma/engines/libquery_engine-debian-openssl-3.0.x.so.node /tmp/prod/app/node_modules/.prisma/client/ && \
    cp -r /app/node_modules/@prisma/client /tmp/prod/app/node_modules/@prisma/ && \
    cp -r /app/node_modules/pyodide/* /tmp/prod/node_modules/pyodide/ && \
    chown -R 65532:65532 /tmp/prod && \
    chmod -R 755 /tmp/prod && \
    chmod 777 /tmp/prod/app/prisma/data && \
    chmod 666 /tmp/prod/app/prisma/data/deploy.db

FROM base AS dependencies
USER root
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz litestream.tar.gz
RUN tar -xzf litestream.tar.gz && \
    mv litestream /usr/bin/litestream && \
    chmod +x /usr/bin/litestream && \
    rm -rf litestream.tar.gz
COPY backend/litestream.yml /litestream.yml
COPY backend/run.sh /run.sh
RUN chmod +x /run.sh

FROM gcr.io/distroless/cc-debian12:debug@sha256:c1aad82df2b344ef00c9d01608f6ef13b833e50be2affb63fb4e87fe03df46e4 AS production
WORKDIR /
COPY --from=build /tmp/prod/node_modules /node_modules
COPY --from=build /tmp/prod/app /app
COPY --from=dependencies /usr/bin/litestream /app/litestream
COPY --from=dependencies /litestream.yml /app/litestream.yml
COPY --from=dependencies /run.sh /app/run.sh
ENV NODE_ENV=production \
    DATABASE_URL=file:/app/prisma/data/deploy.db \
    PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node
WORKDIR /app
USER nonroot
EXPOSE 3000
CMD ["run.sh"]
