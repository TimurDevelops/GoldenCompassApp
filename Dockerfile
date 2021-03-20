FROM nginx:1.18
COPY client/build/index.html /usr/share/nginx/html
