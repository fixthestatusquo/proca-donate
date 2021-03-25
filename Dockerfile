
FROM keymetrics/pm2:latest-slim

COPY donate.js ./
COPY package.json package-lock.json ./

RUN npm install --clean --production

ENV PATH="node_modules/.bin/:${PATH}"

RUN ls -al -R

CMD [ "pm2-runtime", "donate.js" ]
