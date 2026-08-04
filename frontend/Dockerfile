FROM node:20-alpine AS base
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# NEXT_PUBLIC_* variables are compiled into the client-side JS bundle at
# `next build` time — setting them as a runtime environment variable (e.g.
# Railway's dashboard env vars, or docker-compose's `environment:` block)
# has NO effect on an already-built image. They must be passed as a Docker
# build ARG so they're present in the environment during `npm run build`.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
