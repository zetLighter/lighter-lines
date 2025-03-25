from node:alpine as front

copy . .


from nginx:stable-alpine

copy --from=front /html /usr/share/nginx/html
copy --from=front nginx.conf /etc/nginx/conf.d/default.conf

expose 3000

cmd ["nginx", "-g", "daemon off;"]
