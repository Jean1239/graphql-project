import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken } from "../utils/jwtFunctions";
import { MyContext } from "../types";
import { sendRefreshToken } from "../sendRefreshToken";

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
			const token = createAccessToken(user);
			return token;
		} catch (error) {
			console.log(error);
			throw new Error("Erro ao criar a conta");
		}
	}

	@Mutation(() => String)
	async login(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	): Promise<string> {
		const user = await User.findOneBy({ username });
		if (!user) {
			throw new Error("Username não existe");
		}
		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			throw new Error("Senha incorreta");
		}

		sendRefreshToken(res, createRefreshToken(user));

		return createAccessToken(user);
	}

	@Mutation(() => Boolean)
	async revokeToken(
		@Arg("userId", () => Int) userId: number
	): Promise<boolean> {
		await User.getRepository().increment(
			{ id: userId },
			"token_version",
			1
		);
		return true;
	}
}
