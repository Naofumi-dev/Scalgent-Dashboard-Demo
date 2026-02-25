FROM node:18-alpine

WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Railway sets PORT automatically
EXPOSE ${PORT:-3001}

CMD ["node", "server/index.cjs"]
