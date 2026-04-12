import React from 'react';

const SeverityBadge = ({ severity }) => {
    const normalizedSeverity = severity?.toLowerCase() || 'normal';

    const config = {
        high: { bg: 'bg-red-100', text: 'text-red-700', label: '🔴 HIGH SEVERITY' },
        medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: '🟡 MEDIUM' },
        low: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🟡 LOW' },
        normal: { bg: 'bg-green-100', text: 'text-green-700', label: '🟢 NORMAL' },
    };

    const current = config[normalizedSeverity] || config.normal;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${current.bg} ${current.text}`}>
            {current.label}
        </span>
    );
};

export default SeverityBadge;
