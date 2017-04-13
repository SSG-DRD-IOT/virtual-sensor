FROM node:7.7.4-alpine
ADD . /code
WORKDIR /code
RUN npm install
ENTRYPOINT ["node","virtual-sensor.js"]
EXPOSE 1883
