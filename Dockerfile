FROM node:18-alpine as buildimage

RUN apk add --no-cache --virtual .build-deps \
        python3-dev \
        chromium \
        gcc \ 
        g++ \
        binutils-gold \
        curl \
        gnupg \
        libgcc \
        linux-headers \
        make \
        git \
        openssl \ 
        openssh
# --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main


# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package*.json /tmp/
RUN cd /tmp && npm ci --audit=false
RUN mkdir -p /src/sharda && cp -a /tmp/node_modules /src/sharda/ && rm -rf /tmp/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /src/sharda
ADD . /src/sharda
RUN cd /src/sharda

ENTRYPOINT ["npm", "start"]
