import { Arg, Mutation, Resolver, Args } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";

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
}
