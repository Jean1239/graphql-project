"use client";
import { RegisterForm } from "@/components/registerForm";

type Inputs = {
	username: string;
	email: string;
	password: string;
};

export default function Register() {
	return <RegisterForm />;
}
