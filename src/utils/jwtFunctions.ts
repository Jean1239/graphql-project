import jwt from "jsonwebtoken";

interface UserInterface {
	id: number;
}

export const createToken = (user: UserInterface): string => {
	const token = jwt.sign(user, process.env.JWT_SECRET);
	return token;
};

export const decodeToken = (token: string): UserInterface => {
	const user = jwt.verify(token, process.env.JWT_SECRET);
	return <UserInterface>user;
};
