FROM node:16

WORKDIR /usr/src/app/todo-backend-dev

COPY . .

RUN npm ci

CMD npm run dev