"use client";

import { GlobalStateProvider } from "../context/GlobalStateContext";

export function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GlobalStateProvider>{children}</GlobalStateProvider>
	);
}
