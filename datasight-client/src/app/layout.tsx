import type { Metadata } from "next";
import { Inter, Libre_Franklin } from "next/font/google";
import "./globals.css";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import { GlobalStateProvider } from "./context/GlobalStateContext";
import { LoadingMessageProvider } from "./context/LoadingMessageContext";

const inter = Inter({ subsets: ["latin"] });
const libreFranklin = Libre_Franklin({
	subsets: ["latin"],
	variable: "--font-libre-franklin",
});

export const metadata: Metadata = {
	title: "Data Sight",
	description: "A capstone project for group 3b.",
	icons: {
		icon: '/company-logo-no-text.png', // Relative path to your favicon in the public folder
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} ${libreFranklin.variable} antialiased`}
			>
				<LoadingMessageProvider> 
					<GlobalStateProvider>
						<ConfigureAmplifyClientSide />
						{children}
					</GlobalStateProvider>
				</LoadingMessageProvider>
			</body>
		</html>
	);
}
