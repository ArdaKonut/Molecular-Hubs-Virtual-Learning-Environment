# syntax=docker/dockerfile:1
ARG NODE_VERSION=18

FROM node:${NODE_VERSION}
HEALTHCHECK CMD curl -f http://localhost:7000/meta || exit 1
RUN apt-get update && apt-get install -y \
  python3-pip \
  && rm -rf /var/lib/apt/lists/*
COPY files/conditional-npm-ci /usr/local/bin/conditional-npm-ci
COPY priv/perms.pub.pem /etc/perms.pub.pem
COPY priv/fullchain.pem /etc/ssl/fullchain.pem
COPY priv/privkey.pem /etc/ssl/privkey.pem
CMD ["npm", "start"]
