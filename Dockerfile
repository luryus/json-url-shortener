FROM node:7-alpine

RUN mkdir -p /usr/share/app
WORKDIR /usr/share/app

RUN mkdir -p /usr/share/app-config

COPY package.json /usr/share/app/
RUN npm install

COPY . /usr/share/app
RUN npm run build

EXPOSE 4455

ENTRYPOINT ["npm", "start", "/usr/share/app-config/sites.json"]