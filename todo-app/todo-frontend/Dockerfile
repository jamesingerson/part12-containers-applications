# build
FROM node:16 AS build-stage

ENV REACT_APP_BACKEND_URL="http://localhost:8080/api/"

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# test
FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app /usr/src/app

RUN CI=true npm test

# serve
FROM nginx:1.20-alpine

COPY --from=test-stage /usr/src/app/build /usr/share/nginx/html