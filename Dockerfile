FROM node:16-slim as builder
WORKDIR /app
COPY . .
RUN npm install

FROM node:16-slim
WORKDIR /app
COPY --from=builder /app /app

CMD npm run start
