"use client";

import { HelloDocument } from "@/graphql/generated/graphql";
import { useQuery } from "@apollo/client";

export default function Hello() {
	const { data } = useQuery(HelloDocument);
	return <div>{data?.hello}</div>;
}
