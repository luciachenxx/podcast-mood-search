import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="py-16 text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-amber-500 border-r-orange-500 border-b-rose-500 border-l-yellow-500" />
        <p className="text-xl font-medium text-amber-800">正在為你搜尋最合適的內容...</p>
        <p className="mt-2 text-sm text-amber-600">這可能需要幾秒鐘時間</p>
    </div>
);

export default LoadingSpinner;
