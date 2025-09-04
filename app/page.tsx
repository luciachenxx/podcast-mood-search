import React from 'react';
import { Metadata } from 'next';
import SoulCast from '@/components/SoulCast';

export const metadata: Metadata = {
    title: 'SoulCast',
    description:
        '根據你的心情狀態，智能推薦最適合的 Podcast 內容。療癒、學習、放鬆，每種心情都有專屬的聲音陪伴。',
    keywords: ['podcast', '心情', '音頻', '療癒', '學習', '放鬆'],
    openGraph: {
        title: 'SoulCast - 心情音頻陪伴',
        description: '依心情尋找心靈的陪伴',
        type: 'website',
    },
};

const SoulCastPage: React.FC = () => {
    return <SoulCast />;
};

export default SoulCastPage;
