# gRPC Filtering Service

## Overview

Monorepo with two NestJS microservices: a **producer** gRPC server that exposes user data, and a **consumer** that calls it on startup and logs users filtered by age (`age > 18`).

## Project Structure

```
grpc_filtering_service/
├── producer/          # gRPC server (UserService)
├── consumer/          # gRPC client
├── proto/
│   └── users.proto    # Shared contract
└── docker-compose.yml
```

## How to Run (Docker — Recommended)

From the repository root:

```bash
docker compose up -d --build
docker compose logs -f
```

Filtered users are printed in the **consumer** logs (`Filtered Users:`).

## How to Run (Local without Docker)

Use two terminals. Start the producer first, then the consumer.

**Producer**

```bash
cd producer
yarn install
yarn start:dev
```

**Consumer**

```bash
cd consumer
yarn install
yarn start:dev
```

Ensure `consumer/.env` points at the producer (`PRODUCER_GRPC_URL=localhost:50051`).

## Key Implementation Details

- **`OnModuleInit` in the consumer** — The gRPC call runs in `onModuleInit()` after `ClientsModule` wiring is ready, avoiding race conditions with manual lifecycle hooks in `main.ts`.
- **Dynamic `.proto` path resolution** — Both services resolve `users.proto` via `existsSync` against `proto/` (Docker) and `../proto/` (local dev from `producer/` or `consumer/`), so the same code runs in either environment.
- **Config-driven gRPC URLs** — `@nestjs/config` supplies `GRPC_URL` on the producer and `PRODUCER_GRPC_URL` on the consumer (`ClientsModule.registerAsync` + `ConfigService`); Docker Compose overrides the consumer URL to `producer:50051`.
