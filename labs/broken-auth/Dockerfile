FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production --silent
COPY . .
EXPOSE 3003
CMD ["node","index.js"]
