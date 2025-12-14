import React from 'react';

export default function Card({ title, children, className = '' }) {
    return (
        <div className={`bg-[#1e222d] border border-[#2a2e39] rounded shadow-sm p-4 ${className}`}>
            {title && (
                <div className="mb-3 flex items-center justify-between border-b border-[#2a2e39] pb-2">
                    <h2 className="text-sm font-semibold text-[#d1d4dc] uppercase tracking-wide">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}
