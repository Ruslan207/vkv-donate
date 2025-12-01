# Real-time моніторинг транзакцій Monobank для ВКВ

## How to deploy

1. Install [MongoDB Community Edition](https://www.mongodb.com/docs/v7.0/administration/install-community/)
2. Install [Node.js v22](https://nodejs.org/en/)
3. Install Yarn
4. Run `yarn install`
5. Define `DB_URL` and `DOMAIN` environment variable
6. Run `server:build`
7. Run `client:build`
8. Run `server:start:prod`
9. Configure Nginx (or other web server) to serve `dist/apps/client/browser` directory and proxy `/api/` requests to `localhost:3000`
