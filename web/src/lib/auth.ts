import { cookies } from "next/headers";
import { getAccessToken, setAccessToken } from "./token";

export async function setServerSideAccesToken() {
	const token = getAccessToken();
	if (token === undefined || token === null || token === "") {
		const refresh_token = cookies().get("jid")?.value;
		if (refresh_token) {
			const header = new Headers();
			header.append("Cookie", `jid=${refresh_token}`);
			const response = await fetch(
				"http://localhost:4000/refresh_token",
				{
					method: "POST",
					credentials: "include",
					headers: header,
				}
			);
			const { ok, accessToken } = await response.json();
			if (ok) {
				setAccessToken(accessToken);
			}
		}
	}
}
