# ---- Build Stage ----
FROM node:18-slim AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copy built files to nginx html folder
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]