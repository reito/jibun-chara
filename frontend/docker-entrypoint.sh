#!/bin/sh

# 環境変数のデフォルト値を設定
: ${BACKEND_URL:=http://localhost:3000}

# nginx.conf.templateから環境変数を置換してnginx.confを生成
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# nginxを起動
exec nginx -g 'daemon off;'