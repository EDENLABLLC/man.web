FROM node:10-alpine as builder
ENV NODE_ENV production
RUN apk --no-cache add build-base python
RUN npm config set unsafe-perm true
RUN npm install npm@6 --global --quiet
RUN mkdir -p /opt/target
WORKDIR /opt/src
COPY . .
RUN npm ci
RUN mv nginx.conf /opt/target/
RUN npm run build
RUN mv build /opt/target/

FROM nginx:stable-alpine
EXPOSE 80
RUN apk --no-cache add jq
COPY --from=builder /opt/target/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/target/build /usr/share/nginx/html
RUN chown nginx.nginx /usr/share/nginx/html/ -R
CMD jq -nc 'env | with_entries(select(.key | test("^REACT_APP_")))' \
      | echo "window.process={env:$(cat)}" \
      > /usr/share/nginx/html/runtime-env.js \
    && nginx -g 'daemon off;'
