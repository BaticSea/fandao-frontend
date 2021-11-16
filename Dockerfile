FROM node:14

# Install this separately, so puppeteer does not install it
# Otherwise puppeteer will complain about it not being available for arm64
RUN apt-get update && \
    apt-get install -y chromium

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY babel.config.js .
COPY .eslintignore .
COPY .eslintrc.js .
COPY .prettierrc .
COPY scripts .
COPY gulpfile.js .
COPY package.json .
COPY yarn.lock .
COPY .env .
COPY index.d.ts .

# Yarn would timeout with the material-ui package(s), so we override the timeout
RUN yarn --network-timeout 1000000

EXPOSE 3000

# Run the frontend by default
ENTRYPOINT yarn start
