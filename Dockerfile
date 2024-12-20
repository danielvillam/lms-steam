FROM node:20.12.2 as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:alpine as runner

COPY --from=builder app/build/ /usr/share/nginx/html