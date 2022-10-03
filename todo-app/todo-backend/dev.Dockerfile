FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]