FROM node:24-alpine

WORKDIR /app

COPY producer/package*.json ./
RUN npm install

COPY producer/nest-cli.json producer/tsconfig.json producer/tsconfig.build.json ./
COPY producer/src ./src
COPY proto ./proto

RUN npm run build

CMD ["npm", "run", "start:prod"]
