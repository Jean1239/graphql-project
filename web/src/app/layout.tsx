import Nav from "./navbar";
import { Providers } from "./providers";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-br">
			<body>
				<Providers>
					<Nav />
					{children}
				</Providers>
			</body>
		</html>
	);
}
