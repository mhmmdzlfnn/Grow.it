# Stage 1: Build the React application
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Copy the built assets to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config to handle client-side routing and Cloud Run's port requirement
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the container to listen on port 8080 (or the PORT environment variable)
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
