FROM oostvoort/nodemon:16

WORKDIR opt/

COPY dashboard dashboard

WORKDIR ./dashboard
RUN ls -al
RUN cat .env.dev > .env.local

RUN yarn install
RUN yarn build
CMD yarn start

EXPOSE 8080
