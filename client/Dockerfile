FROM arm64v8/node:14.5.0-alpine

# Set the working directory to /app inside the container
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

ENV NODE_ENV=development

RUN npm install
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)

EXPOSE 1234
# Start the app
CMD [ "npm", "start" ]
