import * as process from "node:process";

export default () => ({
    NODE_ENV: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
    secret: process.env.SECRET,
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT),
    username: process.env.USERNAMES,
    password: process.env.PASSWORD,
    dbName: process.env.DB_NAME,
})