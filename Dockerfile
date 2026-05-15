# Use Node.js for building
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy built files from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Add custom Nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
