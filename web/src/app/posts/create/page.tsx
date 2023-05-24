"use client";

import { Form } from "@/components/form";
import { CreatePostDocument } from "@/graphql/generated/graphql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const createPostFormSchema = z.object({
	title: z.string().nonempty({ message: "O título é obrigatório" }),
});

type createPostData = z.infer<typeof createPostFormSchema>;

export default function CreatePost() {
	const router = useRouter();
	const [createPostMutation] = useMutation(CreatePostDocument);
	const createPostForm = useForm<createPostData>({
		resolver: zodResolver(createPostFormSchema),
	});
	const { handleSubmit } = createPostForm;

	async function createPost(values: createPostData) {
		const { data } = await createPostMutation({ variables: values });
		router.push("/");
	}

	return (
		<main className="h-screen flex flex-row gap-6 items-center justify-center">
			<FormProvider {...createPostForm}>
				<form
					onSubmit={handleSubmit(createPost)}
					className="flex flex-col gap-4 w-full max-w-xs"
				>
					<Form.Field>
						<Form.Label>Título</Form.Label>
						<Form.Input type="text" name="title" />
						<Form.ErrorMessage field="title"></Form.ErrorMessage>
					</Form.Field>
					<button
						type="submit"
						className="bg-violet-500 text-white rounded px-3 h-10 text-sm hover:bg-violet-600 font-semibold"
					>
						Criar Post
					</button>
				</form>
			</FormProvider>
		</main>
	);
}
