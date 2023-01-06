FROM node:14.17.3 AS builder

WORKDIR /frontend

COPY . .

RUN yarn build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i 's/keepalive_timeout 65/keepalive_timeout 300/g' /etc/nginx/nginx.conf
# COPY build /usr/share/nginx/html
COPY --from=builder /frontend/build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]