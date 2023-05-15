import { AuthChecker } from "type-graphql";
import { MyContext } from "./types";
import { verify } from "jsonwebtoken";

export const authenticate: AuthChecker<MyContext> = async ({ context }) => {
	const authorization = context.req.headers.authorization;
	if (!authorization) {
		return false;
	}
	try {
		const token = authorization.split(" ")[1];
		const payload = verify(token, process.env.JWT_SECRET);
		context.payload = payload as any;
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};
