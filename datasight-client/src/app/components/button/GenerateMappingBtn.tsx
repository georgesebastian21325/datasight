import React from "react";

interface GenerateMappingBtnProps {
	onGenerateMapping: () => void;
}

const GenerateMappingBtn: React.FC<
	GenerateMappingBtnProps
> = ({ onGenerateMapping }) => {
	return (
		<button
			className=" px-6 py-3 bg-brand-blue hover:bg-black font-medium text-white rounded-md transition-transform transform hover:scale-105 w-fit"
			onClick={onGenerateMapping}
		>
			Generate Mapping
		</button>
	);
};

export default GenerateMappingBtn;
