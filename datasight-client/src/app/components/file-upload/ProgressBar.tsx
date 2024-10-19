interface ProgressBarProps {
    uploadProgress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ uploadProgress }) => {
    return (
        <div className="mt-6">
            <h4 className="text-lg font-medium">Upload Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                    className={`h-4 rounded-full ${uploadProgress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                    style={{ width: `${uploadProgress}%` }}
                >
                    <span className="text-white text-sm block text-center">
                        {Math.round(uploadProgress)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
