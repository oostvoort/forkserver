FROM oostvoort/nodemon:16
WORKDIR /opt/
COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .
