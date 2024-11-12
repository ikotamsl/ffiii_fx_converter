FROM node:lts-alpine

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN pwd

VOLUME /app

RUN npm i

CMD ["npm", "start"]

EXPOSE 3000