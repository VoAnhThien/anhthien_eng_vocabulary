FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve for production (lightweight static server)
RUN npm install -g serve

EXPOSE 3000

# Start the static server
CMD ["serve", "-s", "dist", "-l", "3000"]