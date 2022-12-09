# ALTER Dockerfile

# ### STAGE 1: Build ###
# FROM node:16.13-alpine AS build
# WORKDIR /usr/src/app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# ### STAGE 2: Run ###
# FROM nginx:1.17.1-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=build /usr/src/app/dist/healthmonitoring /usr/share/nginx/html




# NEUER Dockerfile

FROM node:18.12.1-alpine as builder

# install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
# RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
# COPY package.json /usr/src/app/package.json
COPY package.json /usr/src/app/package.json
RUN npm install --force
RUN npm install -g @angular/cli@latest
# RUN npm install -g @angular/cli --unsafe

# add app
COPY . /usr/src/app

# run tests
# RUN ng test --watch=false

# generate build
RUN npm run build

FROM nginx:1.13.9-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist/healthmonitoring /usr/share/nginx/html

RUN echo "mainFileName=\"\$(ls /usr/share/nginx/html/main*.js)\" && \
          envsubst '\$CAPTCHA_SITEKEY ' < \${mainFileName} > main.tmp && \
          mv main.tmp  \${mainFileName} && nginx -g 'daemon off;'" > run.sh

ENTRYPOINT ["sh", "run.sh"]