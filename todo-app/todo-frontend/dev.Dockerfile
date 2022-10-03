FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV REACT_APP_BACKEND_URL="http://localhost:3001"

ENV WATCHPACK_POLLING=true

# npm start is the command to start the application in development mode
CMD ["npm", "start"]