FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html app-ads.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY skywings /usr/share/nginx/html/skywings
COPY ludolegends /usr/share/nginx/html/ludolegends
COPY breakit /usr/share/nginx/html/breakit
COPY gostudio /usr/share/nginx/html/gostudio
COPY backgammon /usr/share/nginx/html/backgammon
COPY invite /usr/share/nginx/html/invite
