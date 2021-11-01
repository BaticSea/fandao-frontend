FROM node:14

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
RUN yarn add @synthetixio/synpress@0.9.14 @interactors/with-cypress@^0.1.3 @testing-library/cypress@^8.0.1 cypress@8.3.0
