import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken } from "../utils/jwtFunctions";
import { MyContext } from "../types";
import { sendRefreshToken } from "../sendRefreshToken";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
	@Field()
	user: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => LoginResponse)
	async register(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("email") email: string
	): Promise<LoginResponse> {
		const user = new User();
		user.username = username;
		user.email = email;

		user.password = await argon2.hash(password);
		try {
			await user.save();
			return { accessToken: createAccessToken(user), user: user };
		} catch (error) {
			console.log(error);
			throw new Error("Erro ao criar a conta");
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOneBy({ username });
		if (!user) {
			throw new Error("Username não existe");
		}
		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			throw new Error("Senha incorreta");
		}

		sendRefreshToken(res, createRefreshToken(user));

		return { accessToken: createAccessToken(user), user: user };
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { res }: MyContext): boolean {
		sendRefreshToken(res, "");
		return true;
	}

	@Query(() => User, { nullable: true })
	async Me(@Ctx() { req }: MyContext): Promise<User | null> {
		const authorization = req.headers.authorization;
		if (!authorization) {
			return null;
		}

		try {
			const token = authorization.split(" ")[1];
			const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET);
			return User.findOneBy({ id: payload.userId });
		} catch (error) {
			console.log(error);
			return null;
		}
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
