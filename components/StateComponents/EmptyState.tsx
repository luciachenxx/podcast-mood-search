import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState: React.FC = () => (
    <div className="py-20 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300">
            <Sparkles className="h-12 w-12 text-amber-600" />
        </div>
        <h3 className="mb-4 text-2xl font-bold text-amber-900">開始探索你的心情</h3>
        <p className="mx-auto max-w-md text-lg text-amber-700">
            輸入你現在的心情，或點擊上方的心情按鈕來發現適合的 Podcast
        </p>
    </div>
);

export default EmptyState;
