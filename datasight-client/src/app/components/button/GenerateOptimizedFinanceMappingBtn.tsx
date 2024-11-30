import React from "react";

interface GenerateOptimizedMappingBtnProps {
	onGenerateOptimizedFinanceMapping: () => void;
}

const GenerateOptimizedFinanceMappingBtn: React.FC<
	GenerateOptimizedMappingBtnProps
	> = ({ onGenerateOptimizedFinanceMapping }) => {
	return (
		<button
			className=" px-3 py-2 bg-green-800 hover:bg-black font-medium text-white rounded-md transition-transform transform hover:scale-105"
			onClick={onGenerateOptimizedFinanceMapping}
		>
			Generate Finance-Optimized Mapping
		</button>
	);
};

export default GenerateOptimizedFinanceMappingBtn;
