import { AuthChecker } from "type-graphql";
import { MyContext } from "./types";
import { User } from "./entities/User";
import { decodeToken } from "./utils/jwtFunctions";

export const authenticate: AuthChecker<MyContext> = async ({ context }) => {
	try {
		const { id } = decodeToken(context.token);
		const user = User.findOneBy({ id });
		if (!user) {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};
