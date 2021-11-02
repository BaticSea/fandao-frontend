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

# Define environment variables supported by Synpress
# Source: https://github.com/Synthetixio/synpress
ENV NETWORK_NAME rinkeby
ENV IS_TESTNET true
# ENV SECRET_WORDS "word1, word2, word3, word4, word5, word6, word7, word8"

# Run Synpress by default when launching the container
CMD [ "npx", "synpress", "run" ]
