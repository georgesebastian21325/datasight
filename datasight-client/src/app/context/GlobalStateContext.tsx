"use client";
// src/context/GlobalStateContext.tsx
import React, {
	createContext,
	useContext,
	useState,
} from "react";

interface GlobalStateContextType {
	selectedNodeId: string | null;
	setSelectedNodeId: (id: string | null) => void;
}

const GlobalStateContext = createContext<
	GlobalStateContextType | undefined
>(undefined);

export function GlobalStateProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [selectedNodeId, setSelectedNodeId] = useState<
		string | null
	>(null);

	return (
		<GlobalStateContext.Provider
			value={{ selectedNodeId, setSelectedNodeId }}
		>
			{children}
		</GlobalStateContext.Provider>
	);
}

export function useGlobalState() {
	const context = useContext(GlobalStateContext);
	if (context === undefined) {
		throw new Error(
			"useGlobalState must be used within a GlobalStateProvider",
		);
	}
	return context;
}
