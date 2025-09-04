import React, { useState } from 'react';
import { Headphones, Play, Loader, Star, Clock } from 'lucide-react';
import { Episode } from '../../types/podcast';
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad';
import TagList from '../UI/TagList';

interface PodcastCardProps {
    episode: Episode;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ episode }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { imageRef, imageLoaded } = useImageLazyLoad(episode.imageUrl);

    const handlePlay = (): void => {
        setIsPlaying(!isPlaying);

        if (!isPlaying) {
            setTimeout(() => setIsPlaying(false), 2000);
        }

        if (episode.audioUrl) {
            window.open(episode.audioUrl, '_blank');
        }
    };

    return (
        <div className="group rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        ref={imageRef}
                        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
                    >
                        {episode.imageUrl && imageLoaded ? (
                            <img
                                src={episode.imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <Headphones className="h-6 w-6 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium text-amber-800">
                            {episode.podcastTitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                            <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                4.{Math.floor(Math.random() * 3) + 6}
                            </span>
                            <span>•</span>
                            <span>{Math.floor(Math.random() * 20) + 5}K 次播放</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePlay}
                    aria-label={isPlaying ? '暫停' : '播放'}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:bg-amber-600"
                >
                    {isPlaying ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Play className="ml-0.5 h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Content */}
            <h3 className="mb-3 text-xl leading-tight font-bold text-amber-900 transition-colors group-hover:text-amber-600">
                {episode.title}
            </h3>

            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-amber-800">
                {episode.description}
            </p>

            {/* 匹配原因 */}
            {episode.matchReason && (
                <div className="mb-3 text-xs text-amber-600 italic">{episode.matchReason}</div>
            )}

            {/* Tags */}
            <TagList tags={episode.tags} className="mb-5" />

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-amber-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{episode.duration}</span>
                </div>
                <span className="text-sm font-medium text-amber-600">{episode.publishDate}</span>
            </div>
        </div>
    );
};

export default PodcastCard;
