FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

ENV CHOKIDAR_USEPOLLING=true

RUN npm install -g serve

CMD ["serve", "build"]