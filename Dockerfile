FROM node:14.17.3 AS builder

WORKDIR /frontend

COPY . .

RUN yarn build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /frontend/build .

CMD [ "nginx","-g","daemon off;"]