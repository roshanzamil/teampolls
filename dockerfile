# Base Image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma Client (Ensure prisma/schema.prisma exists)
RUN npx prisma generate

# Expose the Fastify port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start"]

