FROM node:14

WORKDIR /usr/src/app

# Install the Chromium browser and Cypress dependencies
RUN apt-get update && \
    apt-get install -y \ 
    xvfb \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3-dev \
    libxss-dev \
    chromium

# Install Synpress (which wraps Cypress)
COPY package.json .
COPY yarn.lock .
RUN yarn
