# Use the official Node.js slim image
FROM node:14-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files to the working directory
COPY package*.json ./
COPY index.js ./

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y curl && \
    chmod +x index.js && \
    npm install --production

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
