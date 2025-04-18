FROM node:22-alpine

RUN apk add --no-cache python3 py3-pip make g++

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

# Keep .dockerignore updated if new files are added to repository, that are not to be packaged into the image.
COPY . .

CMD ["node", "index.js"]
EXPOSE 3000