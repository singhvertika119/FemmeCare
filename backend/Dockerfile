FROM node:20-slim

WORKDIR /app

# Ensure rigid dependency lock deployments
COPY package*.json ./
RUN npm install --production

# Map structural code
COPY . .

# Explicitly expose Node port
EXPOSE 5000

# Execute server boot
CMD ["node", "server.js"]
