import React, { useState, useEffect } from 'react';

const ConfidenceBar = ({ confidence, severity }) => {
    const [fillWidth, setFillWidth] = useState(0);

    useEffect(() => {
        // Animate from 0 to actual confidence
        const timeout = setTimeout(() => setFillWidth(confidence), 100);
        return () => clearTimeout(timeout);
    }, [confidence]);

    const normalizedSeverity = severity?.toLowerCase() || 'normal';

    const config = {
        high: 'bg-red-500',
        medium: 'bg-amber-500',
        low: 'bg-yellow-500',
        normal: 'bg-green-500',
    };

    const colorClass = config[normalizedSeverity] || config.normal;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Confidence</span>
                <span className="text-sm font-bold text-gray-900">{confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${fillWidth}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ConfidenceBar;
