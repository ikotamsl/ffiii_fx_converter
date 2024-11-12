FROM node:lts-alpine

WORKDIR /

COPY . .

RUN npm i

CMD ["npm", "start"]

EXPOSE 3000