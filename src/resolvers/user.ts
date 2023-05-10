import {
    Arg,
    ArgsType,
    Field,
    InputType,
    Mutation,
    Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";

@ArgsType()
class UserInput implements Partial<User> {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}

@Resolver()
export class UserResolver {
    // @Mutation(() => User)
    // async register(@Arg("options") options: UserInput): Promise<User | null> {
    //     const user = new User();
    //     user.username = options.username;
    //     user.email = options.email;

    //     user.password = await argon2.hash(options.password);
    //     return await user.save();
    // }
    @Mutation(() => User, { nullable: true })
    async register(@Arg("data") data: UserInput): Promise<User | null> {
        // const user = new User();
        // user.username = username;
        // await user.save();
        const user = new User();
        user.username = data.username;
        user.email = "teste";
        user.password = "teste";
        // await user.save();
        return user;
    }
}
