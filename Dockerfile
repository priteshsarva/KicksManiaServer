FROM ghcr.io/puppeteer/puppeteer:24.1.1

# Set Puppeteer to use the built-in Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=$(npm explore puppeteer -- npm bin)/chromium

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "index.js"]
