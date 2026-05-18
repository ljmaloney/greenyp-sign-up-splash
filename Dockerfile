FROM node:25.9.0-alpine3.22 AS dev

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

# 3. Install dependencies and pnpm globally
RUN npm ci; npm install -g pnpm

# 4. Copy rest of app, including .env for dev
COPY . .

COPY .env.test .env

# 5. Expose Vite default port
EXPOSE 8080

# 6. Run vite in dev mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]