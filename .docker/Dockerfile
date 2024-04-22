FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye as base

RUN npm install npm@latest -g --no-cache --only=production && npm i -g --no-cache --only=production \
    cspell \
    cspell-cli

FROM base as devcontainer