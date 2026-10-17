FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html app-ads.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY skywings /usr/share/nginx/html/skywings
