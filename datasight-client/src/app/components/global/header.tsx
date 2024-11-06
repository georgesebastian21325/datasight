import CompanyLogo from "../../../assets/company-logo.jpg";
import Image from "next/image";
import Link from "next/link";
import { useLoadingMessage } from "@/app/context/LoadingMessageContext";

export default function Header() {
	const { setMessage } = useLoadingMessage();

	const handleLogoClick = () => {
		setMessage("Loading Home Page...");
	};

	return (
		<div>
			<div className="flex items-center justify-center">
				<Link href="/dashboard/resources" onClick={handleLogoClick}>
					<Image
						src={CompanyLogo}
						alt="company logo"
						width={200}
					/>
				</Link>
			</div>
		</div>
	);
}
