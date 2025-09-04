import React from 'react';

const LoadingMore: React.FC = () => (
    <div className="py-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-amber-500 border-r-orange-500 border-b-rose-500 border-l-yellow-500" />
        <p className="text-sm text-amber-700">載入更多結果...</p>
    </div>
);

export default LoadingMore;
