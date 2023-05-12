import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("email") email: string
	): Promise<User | null> {
		const user = new User();
		user.username = username;
		user.email = email;

		user.password = await argon2.hash(password);
		return await user.save();
	}

	@Mutation(() => String)
	async login(
		@Arg("username") username: string,
		@Arg("password") password: string
	): Promise<string> {
		const user = await User.findOneBy({ username });
		if (!user) {
			return "";
		}
		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			return "";
		}

		const token = jwt.sign(user.id.toString(), "teste", {
			algorithm: "HS256",
		});
		return token;
	}
}
