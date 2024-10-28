import React from "react";
import { PropagateLoader } from "react-spinners";
import { motion } from "framer-motion"; // Import framer-motion

const EntityGraphsLoadingState: React.FC = () => {
	return (
		<div className="flex flex-col justify-center items-center h-[50%]">
			<motion.h3
				className="mb-5 text-gray-800 text-lg font-medium"
				animate={{ opacity: [1, 0, 1] }} // Animation for blinking
				transition={{ duration: 1, repeat: Infinity }} // Duration and repeat options
			>
				Generating Graphs...
			</motion.h3>
			<PropagateLoader
				color="#08296C"
				size={17}
			/>
		</div>
	);
};

export default EntityGraphsLoadingState;
