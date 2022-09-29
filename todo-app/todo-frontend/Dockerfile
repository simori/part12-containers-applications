FROM node:16

WORKDIR /usr/src/app/todo_front

COPY . .

# huom backendin oltava päällä containerin ulkona! käytä porttia 3001!
# PORT=3001 MONGO_URL=mongodb://the_username:the_password@127.0.0.1:3456/the_database npm start
# ^ poista toi rivi ennen puskemista gittiin
RUN npm ci

RUN CI=true npm test

ENV REACT_APP_BACKEND_URL="http://127.0.0.1:3001"

CMD npm start