import { sign } from "jsonwebtoken";
import { User } from "../entities/User";

export const createAccessToken = (user: User) => {
	return sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: "15m",
	});
};

export const createRefreshToken = (user: User) => {
	return sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.JWT_SECRET,
		{
			expiresIn: "7d",
		}
	);
};
