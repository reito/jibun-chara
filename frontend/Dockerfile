FROM node:20-alpine as build

WORKDIR /app

# Yarn v3を使用
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

COPY package.json yarn.lock ./
RUN yarn config set nodeLinker node-modules && yarn install --frozen-lockfile

COPY . .

# 本番用ビルド
RUN yarn build

# 本番環境用のサーバー
FROM nginx:alpine

# ビルドしたファイルをnginxにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# nginx設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 