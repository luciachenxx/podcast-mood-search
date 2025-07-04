'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

const EMOTION_TAGS = ['我想放空', '我想被鼓勵', '心情低落', '需要能量'];

export default function PodcastFilterPanel({
    selected,
    onSelect,
    input,
    setInput,
}: {
    selected: string;
    onSelect: (value: string) => void;
    input: string;
    setInput: (val: string) => void;
}) {
    const [localSelected, setLocalSelected] = useState(selected);

    const handleSelect = (tag: string) => {
        setLocalSelected(tag);
    };

    const handleRecommend = () => {
        onSelect(localSelected);
    };

    return (
        <section className="mx-auto mb-6 max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--color-secondary-100)]">今天的心情是…</p>

            <input
                className="w-full rounded-xl border border-gray-300 p-3 text-base"
                placeholder="輸入例如：孤單 焦慮 想放空"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-wrap gap-3">
                {EMOTION_TAGS.map((tag) => (
                    <button
                        key={tag}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${localSelected === tag ? 'bg-[var(--color-secondary-100)] text-white' : 'bg-chip text-gray-700 hover:text-white hover:opacity-80'}`}
                        onClick={() => handleSelect(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <button
                onClick={handleRecommend}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-secondary-50)] py-3 text-center text-white transition hover:bg-[var(--color-secondary-100)]"
            >
                <Play size={18} /> 為我推薦
            </button>
        </section>
    );
}
