FROM node:20

WORKDIR /app

# Yarn v3を使用
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

COPY package.json yarn.lock ./
RUN yarn config set nodeLinker node-modules && yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"] 