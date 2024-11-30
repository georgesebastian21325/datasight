import React from "react";

interface GenerateOptimizedRiskMappingBtnProps {
	onGenerateOptimizedMapping: () => void;
}

const GenerateOptimizedRiskMapping: React.FC<
 GenerateOptimizedRiskMappingBtnProps
> = ({ onGenerateOptimizedMapping }) => {
	return (
		<button
			className=" px-6 py-2 bg-brand-orange hover:bg-black font-medium text-white rounded-md transition-transform transform hover:scale-105"
			onClick={onGenerateOptimizedMapping}
		>
			Generate Risk-Optimized Mapping
		</button>
	);
};

export default GenerateOptimizedRiskMapping;
