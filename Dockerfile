FROM node:16.17.0-bullseye-slim AS base-stage

WORKDIR /usr/src/app
# For cache optimization .json files are handled separately. The npm install command is only run if the dependencies have changed.
COPY package*.json .

RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]