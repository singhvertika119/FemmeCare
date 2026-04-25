# Stage 1: Build the React Application natively
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the statically optimized artifacts via Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy statically built files from Vite's native dist folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Map custom NGINX fallback routing natively tracking React Router dynamics
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
