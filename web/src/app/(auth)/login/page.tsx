"use client";
import { Form } from "@/components/form";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { LoginDocument, RegisterDocument } from "@/graphql/generated/graphql";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/token";

const loginUserFormSchema = z.object({
	username: z
		.string()
		.nonempty({ message: "O username é obrigatório" })
		.toLowerCase(),
	password: z.string().nonempty({ message: "A senha é obrigatória" }),
});

type loginUserData = z.infer<typeof loginUserFormSchema>;

export default function Register() {
	const router = useRouter();
	const [loginMutation] = useMutation(LoginDocument);
	const loginUserForm = useForm<loginUserData>({
		resolver: zodResolver(loginUserFormSchema),
	});
	const {
		handleSubmit,
		// formState: { isSubmitting },
	} = loginUserForm;

	async function login(values: loginUserData) {
		const { data } = await loginMutation({ variables: values });
		setAccessToken(data!.login.accessToken);
		router.push("/");
	}

	return (
		<main className="h-screen flex flex-row gap-6 items-center justify-center">
			<FormProvider {...loginUserForm}>
				<form
					onSubmit={handleSubmit(login)}
					className="flex flex-col gap-4 w-full max-w-xs"
				>
					<Form.Field>
						<Form.Label>Nome de Usuário</Form.Label>
						<Form.Input type="text" name="username" />
						<Form.ErrorMessage field="username"></Form.ErrorMessage>
					</Form.Field>

					<Form.Field>
						<Form.Label>Senha</Form.Label>
						<Form.Input type="password" name="password" />
						<Form.ErrorMessage field="password"></Form.ErrorMessage>
					</Form.Field>
					<button
						type="submit"
						// disabled={isSubmitting}
						className="bg-violet-500 text-white rounded px-3 h-10 text-sm hover:bg-violet-600 font-semibold"
					>
						Login
					</button>
				</form>
			</FormProvider>
		</main>
	);
}
