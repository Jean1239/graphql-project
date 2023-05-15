import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import express from "express";
import { json } from "body-parser";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import cors from "cors";
import { appDataSource } from "./dataSource";
import "dotenv-safe/config";
import { authenticate } from "./auth";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { createAccessToken, createRefreshToken } from "./utils/jwtFunctions";
import { sendRefreshToken } from "./sendRefreshToken";

const main = async () => {
	appDataSource.initialize();
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			authChecker: authenticate,
		}),
	});

	await apolloServer.start();
	app.use(cookieParser());
	app.use(
		"/graphql",
		json(),
		cors<cors.CorsRequest>(),
		cookieParser(),
		expressMiddleware(apolloServer, {
			context: async ({ req, res }): Promise<MyContext> => {
				return { req, res };
			},
		})
	);

	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}

		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
		} catch (error) {
			console.log(error);
			return res.send({ ok: false, accessToken: "" });
		}

		const user = await User.findOneBy({ id: payload.userId });
		if (!user) {
			return res.send({ ok: false, accessToken: "" });
		}

		if (user.token_version !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: "" });
		}

		sendRefreshToken(res, createRefreshToken(user));
		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

	app.listen("4000", () => {
		console.log("Servidor iniciado em localhost:4000");
	});
};

main().catch((error) => console.log(error));
