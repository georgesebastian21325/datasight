import React from 'react';
import {
    PropagateLoader
} from 'react-spinners';
import { motion } from 'framer-motion'; // Import framer-motion

const DataMappingLoadingState: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <motion.h3
                className="mb-5 text-gray-800 text-lg font-medium"
                animate={{ opacity: [1, 0, 1] }} // Animation for blinking
                transition={{ duration: 1, repeat: Infinity }} // Duration and repeat options
            >
                Please wait while the system generates your mapping...
            </motion.h3>
            <PropagateLoader
                color="#08296C" size={17} />
        </div>
    );
};

export default DataMappingLoadingState;
