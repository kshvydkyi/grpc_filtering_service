FROM node:24-alpine

WORKDIR /app

COPY consumer/package*.json ./
RUN npm install

COPY consumer/nest-cli.json consumer/tsconfig.json consumer/tsconfig.build.json ./
COPY consumer/src ./src
COPY proto ./proto

RUN npm run build

CMD ["npm", "run", "start:prod"]
