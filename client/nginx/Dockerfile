FROM node:latest as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ../package.json /usr/src/app  

RUN npm install

COPY . .

RUN npm run build

FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
