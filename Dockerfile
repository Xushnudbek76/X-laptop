FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV TS_NODE_BASEURL=./dist

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY src/views ./dist/views
COPY src/public ./dist/public
COPY uploads/.gitkeep ./uploads/.gitkeep
COPY uploads/members/.gitkeep ./uploads/members/.gitkeep
COPY uploads/products/.gitkeep ./uploads/products/.gitkeep

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3003/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
