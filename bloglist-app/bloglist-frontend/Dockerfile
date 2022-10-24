# build
FROM node:16 AS build-stage

ENV REACT_APP_BACKEND_URL="http://localhost:8080/api/"

WORKDIR /usr/src/bloglist-front

COPY . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

# serve
FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/bloglist-front/build /usr/share/nginx/html
