import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Graphql Client",
	description: "Um cliente para o Apollo Server",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full bg-white">
			<body className={`${inter.className} h-full`}>
				<div className="flex space-x-4 bg-cyan-300">
					<Link href={"/"}>Home</Link>
					<Link href={"/register"}>Register</Link>
				</div>
				<ApolloWrapper>{children}</ApolloWrapper>
			</body>
		</html>
	);
}
