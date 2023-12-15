import mysql from "serverless-mysql";

export const db = mysql({
    config: {
        host: process.env.NEXT_PUBLIC_MYSQL_HOST,
        user: process.env.NEXT_PUBLIC_MYSQL_USER,
        password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
        database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    }
})