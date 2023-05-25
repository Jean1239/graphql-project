import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { setServerSideAccesToken } from "./auth";
import { getAccessToken } from "./token";
import { setContext } from "@apollo/client/link/context";

export const { getClient } = registerApolloClient(() => {
	setServerSideAccesToken();
	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
		credentials: "include",
	});

	const authLink = setContext((_, { headers }) => {
		getAccessToken();
		const token = getAccessToken();
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : "",
			},
		};
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});
});
