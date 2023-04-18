FROM node:16

COPY ./src .
COPY package-lock.json .
COPY package.json .
RUN npm install
EXPOSE 4000
CMD ["node", "index.js"]