# Use a base image with necessary dependencies
FROM ubuntu:latest

# Set environment variables to avoid tzdata prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required dependencies for running Python, JavaScript (Node.js), and C++
RUN apt-get update && apt-get install -y \
    python3 \
    nodejs \
    npm \
    gcc \
    g++

# Set the working directory inside the container
WORKDIR /app

# Copy the entrypoint script into the container
COPY entrypoint.sh /app/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint command
ENTRYPOINT ["/app/entrypoint.sh"]