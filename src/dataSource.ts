import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const appDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "jean",
	password: "!senha148)",
	database: "graphql",
	// synchronize: true,
	logging: true,
	entities: [Post, User],
});
