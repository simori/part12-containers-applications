FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

ENV REACT_APP_BACKEND_URL="http://localhost:3000/api/"

ENV CHOKIDAR_USEPOLLING=true

CMD npm start