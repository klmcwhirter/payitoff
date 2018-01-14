FROM nginx

COPY ./dist /usr/share/nginx/html

RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig \
 && awk '/#gzip/ { printf("    gzip on;\n    gzip_types text/css application/javascript;\n    gzip_min_length 1000;\n"); next; } { print }' \
 /etc/nginx/nginx.conf.orig >/etc/nginx/nginx.conf \
 && rm /etc/nginx/nginx.conf.orig
