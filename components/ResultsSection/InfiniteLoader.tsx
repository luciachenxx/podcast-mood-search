import React from 'react';
import { LoadingMore } from '../StateComponents';

interface InfiniteLoaderProps {
    isLoadingMore: boolean;
    hasMore: boolean;
    loaderRef: React.RefObject<HTMLDivElement | null>;
}

const InfiniteLoader: React.FC<InfiniteLoaderProps> = ({ isLoadingMore, hasMore, loaderRef }) => {
    if (!hasMore) return null;

    return (
        <div ref={loaderRef} className="py-8 text-center">
            {isLoadingMore ? (
                <LoadingMore />
            ) : (
                <div className="text-amber-500 opacity-50">
                    <span>繼續滾動以加載更多</span>
                </div>
            )}
        </div>
    );
};

export default InfiniteLoader;
