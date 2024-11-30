import React from "react";

interface GenerateOptimizedMappingBtnProps {
	onGenerateOptimizedMapping: () => void;
}

const GenerateOptimizedMappingBtn: React.FC<
	GenerateOptimizedMappingBtnProps
> = ({ onGenerateOptimizedMapping }) => {
	return (
		<button
			className=" px-6 py-2 bg-brand-orange hover:bg-black font-medium text-white rounded-md transition-transform transform hover:scale-105"
			onClick={onGenerateOptimizedMapping}
		>
			Generate Optimized Mapping
		</button>
	);
};

export default GenerateOptimizedMappingBtn;
