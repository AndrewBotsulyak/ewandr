FROM nginx:stable

COPY nginx/nginx.prod.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
