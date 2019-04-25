FROM node:10-alpine as builder

ENV NODE_ENV production
ENV NODE_PATH src/

RUN apk --no-cache add build-base python
RUN npm config set unsafe-perm true
RUN npm install npm@6 --global --quiet
RUN npm set unsafe-perm true
RUN mkdir -p /opt/target
WORKDIR /opt
COPY . .
RUN npm ci
RUN mv nginx.conf /opt/target/
RUN npm run build
RUN mv public /opt/target/

FROM nginx:stable-alpine
EXPOSE 3000
COPY --from=builder /opt/target/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/target/public /usr/share/nginx/html
RUN chown nginx.nginx /usr/share/nginx/html/ -R
CMD nginx -g 'daemon off;'
