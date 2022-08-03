FROM node:18-alpine
ADD . /code
WORKDIR /code
RUN npm install
ENTRYPOINT ["node","virtual-sensor.js"]
EXPOSE 1883
