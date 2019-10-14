FROM buildkite/puppeteer:latest

WORKDIR /home/node/user

ENV  PATH="${PATH}:/node_modules/.bin"

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]