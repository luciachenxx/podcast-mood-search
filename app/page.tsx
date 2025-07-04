// app/page.tsx
'use client';

import { useState } from 'react';
import podcastList from '../data/podcasts.json';
// import RInput from '@/components/common/RInput';
import PodcastFilterPanel from '@/components/PodcastFilterPanel';
import PodcastCard from '@/components/PodcastCard';
import { Activity } from 'lucide-react';

export default function Home() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<typeof podcastList>([]);

    const handleSearch = () => {
        const keywords = input.split(' ').filter(Boolean);
        const filtered = podcastList.filter((podcast) => {
            // 搜尋標題、描述和標籤
            const searchableText = [
                podcast.title.toLowerCase(),
                podcast.description.toLowerCase(),
                ...podcast.tags.map((tag) => tag.toLowerCase()),
            ].join(' ');

            return keywords.some((keyword) => searchableText.includes(keyword.toLowerCase()));
        });
        setResults(filtered);
    };

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10 text-[var(--color-secondary-100)]">
            <div className="mb-6 flex items-center justify-center">
                <Activity className="h-10 w-10" />
                <h1 className="ml-2 text-center text-3xl font-semibold">我想聽點什麼</h1>
            </div>
            <p className="mb-2 text-center font-sans text-lg text-[var(--color-subtext-100)]">
                嗨，今天的心情如何？
            </p>
            <p className="mb-2 text-center font-sans text-lg text-[var(--color-subtext-100)]">
                讓我為你尋找最適合此刻的聲音陪伴
            </p>

            <PodcastFilterPanel
                selected={''}
                onSelect={handleSearch}
                input={input}
                setInput={setInput}
            />

            {results.length > 0 && (
                <>
                    <h2 className="mb-4 text-2xl font-semibold">為你找到的聲音</h2>
                    {results.map((podcast) => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                </>
            )}
        </main>
    );
}
