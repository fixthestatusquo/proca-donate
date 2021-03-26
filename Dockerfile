
FROM node:14

COPY donate.js ./
COPY package.json package-lock.json ./

RUN npm install pm2 -g
RUN npm install --clean --production

ENV PATH="node_modules/.bin/:${PATH}"

CMD [ "pm2-runtime", "donate.js" ]
