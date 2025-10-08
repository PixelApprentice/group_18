FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=base /app/package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base as runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3005
ENV PORT 3005

CMD ["pnpm", "start"]
