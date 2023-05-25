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
import { getAccessToken, setAccessToken } from "./token";

async function getAccessTokenFromRefreshToken() {
	const response = await fetch("http://localhost:4000/refresh_token", {
		method: "POST",
		credentials: "include",
	});
	const { ok, accessToken } = await response.json();
	if (ok) {
		setAccessToken(accessToken);
	}
}

function makeClient() {
	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
		credentials: "include",
	});

	const authLink = setContext(async (_, { headers }) => {
		await getAccessTokenFromRefreshToken();
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
