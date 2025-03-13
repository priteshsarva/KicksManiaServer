FROM ghcr.io/puppeteer/puppeteer:24.1.1

# Skip Puppeteer's Chromium download
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install dependencies (if needed)
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Find Puppeteer's Chromium path and store it in an environment variable
RUN echo "export PUPPETEER_EXECUTABLE_PATH=$(node -e \"console.log(require('puppeteer').executablePath())\")" >> ~/.bashrc

CMD ["node", "index.js"]
