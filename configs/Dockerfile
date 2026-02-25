# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# source
COPY . .

# Vite build-time env (클라이언트에 포함될 값)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# build -> dist/
RUN npm run build

# 2) Runtime stage (nginx serve)
FROM nginx:1.27-alpine

# nginx config
COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf

# static files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]