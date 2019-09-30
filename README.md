## Description

Pipedrive test assignment backend application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm start

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
$ npm test

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database

Application uses MySQL as database.

To run test and the application you need to install docker (or configure the database locally).

The first time you start the database using the docker-compose file, run the following commands (you need a mysql client):

```bash
$ mysql --host=127.0.0.1 --port=3307 --user=root --password=verySecure123

mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'verySecure123'
```
