import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import express from "express";
import { json } from "body-parser";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { PostResolver } from "./resolvers/post";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const appDataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "jean",
        password: "!senha148)",
        database: "lireddit",
        synchronize: true,
        logging: true,
        entities: [Post, User],
    });

    appDataSource
        .initialize()
        .then(() => {
            console.log("Data Source has been initialized!");
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
        }),
    });

    await apolloServer.start();
    app.use("/graphql", json(), expressMiddleware(apolloServer));

    app.listen("4000", () => {
        console.log("Servidor iniciado em localhost:4000");
    });
};

main().catch((err) => {
    console.error(err);
});
