import { Authorized, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
	@Authorized()
	@Query(() => String)
	hello() {
		return "hello world";
	}
}
