# Image du frontend Next.js (build multi-étapes -> image finale légère)

# --- 1) Dépendances ---
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
# pnpm-workspace.yaml porte `allowBuilds` (build natif de sharp/unrs-resolver) :
# indispensable ici, sinon pnpm v9 ignore ces build scripts et next/image casse.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- 2) Build ---
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
ENV NEXT_TELEMETRY_DISABLED=1
# Hôte du backend connu au build : next.config l'utilise pour autoriser
# next/image à charger les médias uploadés (logos, couvertures) depuis Django.
ARG BACKEND_API_URL=http://localhost:8000
ENV BACKEND_API_URL=$BACKEND_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- 3) Exécution (serveur autonome) ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Sortie "standalone" : serveur + node_modules minimal
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
