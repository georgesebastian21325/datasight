import CompanyLogo from "../../../assets/company-logo.jpg";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<div>
			<div className="flex items-center justify-center">
				<Link href="./home-page">
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
