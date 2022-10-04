FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV WATCHPACK_POLLING=true
ENV PORT=3001

CMD ["npm", "run", "dev"]