import { AuthChecker } from "type-graphql";
import { MyContext } from "./types";
import jwt from "jsonwebtoken";

export const authenticate: AuthChecker<MyContext> = ({ context }) => {
	const token = context.req.headers.authorization;
	console.log("authorization: ", token);
	if (!token) {
		console.log("TESTE");
		return false;
	}
	const payload = jwt.verify(token, "teste", { algorithms: ["HS256"] });
	if (!payload) {
		return false;
	}
	return true;
};
