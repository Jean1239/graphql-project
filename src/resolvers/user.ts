import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { createToken } from "../utils/jwtFunctions";

@Resolver()
export class UserResolver {
	@Mutation(() => String)
	async register(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("email") email: string
	): Promise<string> {
		const user = new User();
		user.username = username;
		user.email = email;

		user.password = await argon2.hash(password);
		try {
			await user.save();
			const token = createToken({ id: user.id });
			return token;
		} catch (error) {
			console.log(error);
			throw new Error("Erro ao criar a conta");
		}
	}

	@Mutation(() => String)
	async login(
		@Arg("username") username: string,
		@Arg("password") password: string
	): Promise<string> {
		const user = await User.findOneBy({ username });
		if (!user) {
			throw new Error("Falha no login");
		}
		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			throw new Error("Falha no login");
		}

		const token = createToken({ id: user.id });
		return token;
	}
}
