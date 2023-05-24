import { PostsDocument } from "@/graphql/generated/graphql";
import { getClient } from "@/lib/client";

export default async function Home() {
	const { data } = await getClient().query({
		query: PostsDocument,
		context: {
			fetchOptions: {
				next: { revalidate: 5 },
			},
		},
	});

	return (
		<ul>
			{data.posts.map(({ id, title }) => {
				return <li key={id}>{title}</li>;
			})}
		</ul>
	);
}
