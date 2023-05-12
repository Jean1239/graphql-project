import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import express from "express";
import { json } from "body-parser";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { authenticate } from "./auth";
import { MyContext } from "./types";
import cors from "cors";
import { appDataSource } from "./dataSource";

const main = async () => {
	appDataSource.initialize();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			authChecker: authenticate,
			authMode: "null",
		}),
	});

	await apolloServer.start();
	app.use(
		"/graphql",
		json(),
		cors<cors.CorsRequest>(),
		expressMiddleware(apolloServer, {
			context: async ({ req, res }): Promise<MyContext> => ({ req, res }),
		})
	);

	app.listen("4000", () => {
		console.log("Servidor iniciado em localhost:4000");
	});
};

main().catch((error) => console.log(error));
