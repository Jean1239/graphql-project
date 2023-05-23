"use client";
import { Form } from "@/components/form";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { RegisterDocument } from "@/graphql/generated/graphql";
import { useRouter } from "next/navigation";

const createUserFormSchema = z.object({
	username: z
		.string()
		.nonempty({ message: "O username é obrigatório" })
		.toLowerCase(),
	email: z
		.string()
		.nonempty({ message: "O email é obrigatório" })
		.email({ message: "Formato de email inválido" })
		.toLowerCase(),
	password: z
		.string()
		.nonempty({ message: "A senha é obrigatória" })
		.min(6, { message: "A senha precisa ter no mínimo 6 caracteres" }),
});

type CreateUserData = z.infer<typeof createUserFormSchema>;

export default function Register() {
	const router = useRouter();
	const [registerMutation] = useMutation(RegisterDocument);
	const createUserForm = useForm<CreateUserData>({
		resolver: zodResolver(createUserFormSchema),
	});
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = createUserForm;

	async function createUser(data: CreateUserData) {
		const response = await registerMutation({ variables: data });
		console.log(response);
		router.push("/");
	}

	return (
		<main className="h-screen flex flex-row gap-6 items-center justify-center">
			<FormProvider {...createUserForm}>
				<form
					onSubmit={handleSubmit(createUser)}
					className="flex flex-col gap-4 w-full max-w-xs"
				>
					<Form.Field>
						<Form.Label>Nome de Usuário</Form.Label>
						<Form.Input type="text" name="username" />
						<Form.ErrorMessage field="username"></Form.ErrorMessage>
					</Form.Field>

					<Form.Field>
						<Form.Label>Email</Form.Label>
						<Form.Input type="text" name="email" />
						<Form.ErrorMessage field="email"></Form.ErrorMessage>
					</Form.Field>

					<Form.Field>
						<Form.Label>Senha</Form.Label>
						<Form.Input type="password" name="password" />
						<Form.ErrorMessage field="password"></Form.ErrorMessage>
					</Form.Field>
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-violet-500 text-white rounded px-3 h-10 text-sm hover:bg-violet-600 font-semibold"
					>
						Criar Conta
					</button>
				</form>
			</FormProvider>
		</main>
	);
}
