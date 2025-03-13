FROM ghcr.io/puppeteer/puppeteer:24.1.1

# Set Puppeteer to use the built-in Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Find Puppeteer's Chromium path and set it as an environment variable
RUN bash -c 'echo "export PUPPETEER_EXECUTABLE_PATH=$(node -e \"console.log(require(\'puppeteer\').executablePath())\")" >> ~/.bashrc'

CMD ["node", "index.js"]
