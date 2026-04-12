import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex h-[80vh] items-center justify-center space-x-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-gray-500 font-medium tracking-wide">Loading data...</span>
        </div>
    );
};

export default LoadingSpinner;
