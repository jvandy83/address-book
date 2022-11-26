FROM arm64v8/node:14.5.0-alpine

# Set the working directory to /app inside the container
WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

ENV NODE_ENV=development

RUN npm install

COPY . .

EXPOSE 1234

CMD [ "npm", "start" ]
