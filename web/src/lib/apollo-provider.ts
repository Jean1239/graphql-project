"use client";

import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	SuspenseCache,
} from "@apollo/client";
import {
	ApolloNextAppProvider,
	NextSSRInMemoryCache,
	SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "./token";

function makeClient() {
	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
		credentials: "include",
	});

	const authLink = setContext((_, { headers }) => {
		// get the authentication token from local storage if it exists
		const token = getAccessToken();
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : "",
			},
		};
	});

	return new ApolloClient({
		cache: new NextSSRInMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true,
						}),
						authLink.concat(httpLink),
				  ])
				: authLink.concat(httpLink),
	});
}

function makeSuspenseCache() {
	return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return ApolloNextAppProvider({
		makeClient: makeClient,
		makeSuspenseCache: makeSuspenseCache,
		children: children,
	});
}
