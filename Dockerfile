FROM node:16.14.0 AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.21.0-alpine AS final
RUN apk add --no-cache bash busybox-extras curl
WORKDIR /usr/share/nginx/html
RUN rm -f ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /build/dist/lg-ui .
