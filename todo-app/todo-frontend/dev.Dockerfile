FROM node:16

WORKDIR /usr/src/app/todo_front_dev

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

ENV WATCHPACK_POLLING=true

# npm start is the command to start the application in development mode
CMD ["npm", "start"]