import React from 'react';
import { Episode } from '../../types/podcast';
import PodcastCard from './PodcastCard';
import InfiniteLoader from './InfiniteLoader';

interface PodcastGridProps {
    episodes: Episode[];
    isLoadingMore: boolean;
    hasMore: boolean;
    loaderRef: React.RefObject<HTMLDivElement | null>;
}

const PodcastGrid: React.FC<PodcastGridProps> = ({
    episodes,
    isLoadingMore,
    hasMore,
    loaderRef,
}) => {
    return (
        <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
                {episodes.map((episode, index) => (
                    <PodcastCard
                        key={`podcast-${episode.id}-${index}-${Date.now()}`}
                        episode={episode}
                    />
                ))}
            </div>

            <InfiniteLoader isLoadingMore={isLoadingMore} hasMore={hasMore} loaderRef={loaderRef} />
        </div>
    );
};

export default PodcastGrid;
