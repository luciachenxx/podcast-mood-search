'use client';
import { Play } from 'lucide-react';

export default function PodcastCard({
    podcast,
}: {
    podcast: {
        id: number;
        title: string;
        description: string;
        tags: string[];
        audioUrl: string;
    };
}) {
    if (!podcast) return null;

    return (
        <div className="my-4 flex cursor-pointer flex-row justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm transition-all hover:opacity-80 hover:shadow-md">
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">{podcast.title}</h3>

                <p className="mb-1 line-clamp-3 text-sm text-gray-600">{podcast.description}</p>
                {/* 
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {podcast.tags.map((tag) => (
                    <span key={tag} className="bg-chip rounded-full px-3 py-1 text-gray-600">
                        {tag}
                    </span>
                ))}
            </div> */}

                {/* <audio controls className="mt-2 w-full">
                <source src={podcast.audioUrl} type="audio/mpeg" />
                您的瀏覽器不支援 audio 標籤。
            </audio> */}

                <div className="flex items-center gap-1">
                    <span>🎧</span>
                    <span>30分鐘</span>
                    <span>・</span>
                    <span>種類</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Play className="h-8 w-8 hover:rounded-full hover:bg-gray-100 hover:p-1" />
            </div>
        </div>
    );
}
