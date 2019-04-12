FROM node:9.11.2-slim as node
WORKDIR /app
COPY package.json /app/
RUN npm i npm@latest -g
  RUN npm install
COPY ./ /app/
ARG env=prod
RUN npm run build

FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./ /usr/share/nginx/html
COPY --from=node /app/dist/ /usr/share/nginx/html
RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
