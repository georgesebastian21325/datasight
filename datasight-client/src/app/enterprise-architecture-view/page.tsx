import Header from "../components/global/header";
import Link from "next/link";

export default function page() {
    return (
        <div className="flex flex-col lg:flex-row h-screen relative">
            {/* Back Button */}
            <Link href='/home-page'>
                <button className="absolute rounded-md top-4 right-4 px-4 py-2 text-white bg-black hover:bg-gray-500 transition-transform transform hover:scale-105  font-medium shadow-sm">
                    Back
                </button>
            </Link>


            {/* Left sidebar - Console */}
            <div className="w-full lg:w-1/5 h-full overflow-auto border-r border-gray-200 p-4 flex flex-col">
                {/* Logo */}
                <div className='mb-8'>
                    <Header />
                </div>

                <h2 className="text-xl font-bold mb-4">Optimization Options</h2>
                <div className="space-y-2 flex-grow">
                    <button className="w-full text-left px-4 py-2  hover:bg-blue-800  rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Obsolescences</button>
                    <button className="w-full text-left px-4 py-2  hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Capacity</button>
                    <button className="w-full text-left px-4 py-2  hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Finance</button>
                    <button className="w-full text-left px-4 py-2  hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Risk</button>
                </div>

                <button className="mt-12 py-2 mb-12 lg:mt-auto lg:mb-4 lg:px-6 lg:py-2 bg-yellow-500 hover:bg-gray-900 text-white rounded">
                    Present With AI
                </button>
                
            </div>

            {/* Right side - Enterprise Mapping Placeholder */}
            <div className="w-full lg:w-3/3 h-full overflow-auto p-4 pt-16">
                <h2 className="text-xl font-bold mb-1">Enterprise Architecture</h2>
                <p className='mb-3 text-gray-500'> This is the current mapping of your enterprise architecture. </p>

                {/* Generate Mapping Button */}
                <button className="mb-4 px-6 py-2 bg-green-900 hover:bg-green-600 font-medium text-white rounded-md transition-transform transform hover:scale-105">
                    Generate Mapping
                </button>

                <div className="flex items-center justify-center h-[calc(100%-80px)] border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-center">
                        Enterprise mapping visualization will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    )
}