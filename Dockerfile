# Base image: Node 20
FROM node:20

# Install FFmpeg
RUN apt update && apt install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Expose n8n default port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
