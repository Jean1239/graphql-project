"use client";
import { RegisterDocument } from "@/graphql/generated/graphql";
import { useMutation } from "@apollo/client";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
	username: string;
	email: string;
	password: string;
};

export function RegisterForm() {
	const [registerMutation] = useMutation(RegisterDocument);
	const { register, handleSubmit } = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = async (values) => {
		const { data } = await registerMutation({ variables: values });
		console.log(data);
	};

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					className="mx-auto h-10 w-auto"
					src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
					alt="Your Company"
				/>
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Criar Conta
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900">
							Username
						</label>
						<div className="mt-2">
							<input
								{...register("username")}
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900">
							Email
						</label>
						<div className="mt-2">
							<input
								{...register("email")}
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium leading-6 text-gray-900">
								Password
							</label>
						</div>
						<div className="mt-2">
							<input
								{...register("password")}
								type="password"
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Criar Conta
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
