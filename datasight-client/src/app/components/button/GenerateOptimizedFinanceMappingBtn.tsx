import React from "react";

interface GenerateOptimizedMappingBtnProps {
	onGenerateOptimizedMapping: () => void;
}

const GenerateOptimizedFinanceMappingBtn: React.FC<
	GenerateOptimizedMappingBtnProps
> = ({ onGenerateOptimizedMapping }) => {
	return (
		<button
			className=" px-3 py-2 bg-green-800 hover:bg-black font-medium text-white rounded-md transition-transform transform hover:scale-105"
			onClick={onGenerateOptimizedMapping}
		>
			Generate Finance-Optimized Mapping
		</button>
	);
};

export default GenerateOptimizedFinanceMappingBtn;
