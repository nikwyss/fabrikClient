# Build stage
FROM node AS buildenv

WORKDIR /generator

ENV projectName "fabrikClient"
# restore

# copy src

# COPY ./${projectName}/package.json .
# COPY ./${projectName} .
COPY ./package.json .
COPY . .
#RUN npm install -g quasar-cli

RUN npm install

RUN node node_modules/quasar-cli/bin/quasar-build