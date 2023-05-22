import { PostsDocument } from "@/graphql/generated/graphql";
import { getClient } from "@/lib/client";

export const revalidate = 5;

export default async function Home() {
	const client = getClient();
	const { data } = await client.query({ query: PostsDocument });

	return data.posts.map(({ id, title }: any) => (
		<div key={id}>
			<h1>{title}</h1>
		</div>
	));
}
