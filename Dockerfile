FROM node:25.9.0-alpine3.22 AS dev

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

# 3. Install dependencies and pnpm globally
RUN npm ci; npm install -g pnpm

# 4. Copy rest of app, including .env for dev
COPY . .

COPY .env.test .env

# Build production assets
RUN npm run build

# Remove default nginx config
RUN rm /etc/nginx/http.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy built files into nginx web root
RUN mkdir -p /usr/share/nginx/html && \
    cp -r dist/* /usr/share/nginx/html/

EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

## 5. Expose Vite default port
#EXPOSE 8080
#
## 6. Run vite in dev mode
#CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]