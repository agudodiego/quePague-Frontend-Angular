# Usa una imagen base de Node.js para construir la aplicación Angular
FROM node:lts-gallium AS build

WORKDIR /app

# Copia solo package.json para aprovechar la caché en instalaciones
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Usa una imagen de Nginx para servir la aplicación
FROM nginx:alpine
# reemplaza el archivo de configuracion por defecto
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copia los archivos construidos
COPY --from=build /app/dist/que-pague-angular /usr/share/nginx/html

EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]