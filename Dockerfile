FROM ghcr.io/puppeteer/puppeteer:24.1.1

# Install Chromium manually
RUN apt-get update && apt-get install -y chromium

# Ensure Puppeteer uses the correct Chromium path
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /user/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "index.js"]
