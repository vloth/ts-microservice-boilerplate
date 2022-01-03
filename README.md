# ts-microservice-boilerplate
Typescript Microservice Boilerplate: Koa, Zod, Postgresql and Tests

⚠️ this is a typescript version of the
[parenthesin/microservice-boilerplate](https://github.com/parenthesin/microservice-boilerplate).

## About this example
This source is a combination of two namespaces

 - **src/system/\*\*/*.ts**: Helpers and wrappers to give a foundation to create new services in typescript,
you can find components for the database,  webserver and tools for db migrations.
 - **all but the above**: An example of how to use the boilerplate, it's a simple btc wallet
that fetch the current btc price in USD and you can check your transaction history, do deposits and withdrawals.

Verb | URL                | Description
-----| ------------------ | ------------------------------------------------
GET  | /wallet/history    | get all wallet entries and current total
POST | /wallet/deposit    | do a deposit in btc in the wallet
POST | /wallet/withdrawal | do a withdrawal in btc in the wallet if possible

## Running
```bash
# Restore dependencies
yarn install --frozen-lockfile

# Run development server
yarn dev 
```
To overwrite the environment variables, create an env file
named `.env.local` with the variables to be overwritten.
[see more about it here](https://github.com/entropitor/dotenv-cli#cascading-env-variables)


## Run Tests
```bash
# Run unit tests
yarn test
yarn test --watch

# Run tests with coverage
yarn test:coverage

# Run integration tests
yarn test:integration
yarn test:integration --watch
```

## Lint
```bash
# Lint the source code
yarn lint
yarn lint --fix
```

## Docker
Start containers with postgres `user: postgres, password: postgres, hostname: db, port: 5432`  
and [pg-admin](http://localhost:5433) `email: pg@pg.cc, password: pg, port: 5433`
```bash
# Start containers
docker-compose -f docker/docker-compose.yml up -d

# Start only the database
docker-compose -f docker/docker-compose.yml up -d db

# Stop containers
docker-compose -f docker/docker-compose.yml stop

# Destroy containers
docker-compose -f docker/docker-compose.yml down -v --remove-orphans
```

## Features

### System
- [swc](https://github.com/swc-project/swc) Typescript compiler
- [koa](https://github.com/koajs/koa) Http Server
- [zod](https://github.com/colinhacks/zod) Schema & Type
- [node-fetch](https://github.com/node-fetch/node-fetch) Nodejs http fetcher
- [node-postgres](https://github.com/brianc/node-postgres) Database driver
- [pino](https://github.com/pinojs/pino) Logger library
- [swagger-injector](https://github.com/johnhof/swagger-injector) Swagger rendered

### Tests
- [mocha](https://github.com/lambdaisland/kaocha) Test runner
- [fast-check](https://github.com/dubzzz/fast-check) Property testing library
- [testcontainers](https://github.com/testcontainers/testcontainers-node) Docker container fixture for integration tests
- [ts-sinon](https://github.com/ttarnowski/ts-sinon) Mocking library

## Directory Structure
```
./
├── .github
│   └── workflows -- TODO
├── docker -- docker-compose files for the database
├── resources -- Application resources assets folder and configuration files.
│   ├── migrations -- Current database schemas, synced on service startup.
│   └── scripts -- Application script files
└── src -- Source code folder
    ├── system -- Source for common utilities and helpers.
    ├── schemas -- Schema source code
    ├── test -- Test helpers and source code
    │   ├── unit -- Unit tests and source code
    │   └── integration -- Integration tests
    └── * -- Source for the service example (wallet).
```

## License
This is free and unencumbered software released into the public domain.  
For more information, please refer to <http://unlicense.org>
