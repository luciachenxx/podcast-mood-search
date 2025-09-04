import { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollProps {
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export const useInfiniteScroll = ({
    hasMore,
    isLoading,
    isLoadingMore,
    onLoadMore,
}: UseInfiniteScrollProps) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
                onLoadMore();
            }
        },
        [hasMore, isLoading, isLoadingMore, onLoadMore]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleObserver]);

    return { loaderRef };
};
