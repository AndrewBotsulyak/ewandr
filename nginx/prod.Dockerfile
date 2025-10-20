FROM nginx:stable

COPY nginx/nginx.prod.conf /etc/nginx/nginx.conf
COPY nginx/robots.txt /usr/share/nginx/html/robots.txt

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
