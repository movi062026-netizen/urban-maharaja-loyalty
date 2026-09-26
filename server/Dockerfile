# ==============================================================================
# Urban Maharaja Royalty Platform — Server Dockerfile (Root Directory: server)
# Optimized for Render Web Service deployment
# ==============================================================================

FROM node:20-alpine AS runner

# Install dumb-init for proper PID 1 signal forwarding and curl for health checks
RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Set default production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy application source code
COPY src ./src

# Create non-root user security context
RUN chown -R node:node /app
USER node

# Expose default port (Render will inject its own PORT)
EXPOSE 5000

# Health check probe against API health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/api/v1/health || exit 1

# Launch with dumb-init to gracefully handle SIGTERM and SIGINT
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/server.js"]
