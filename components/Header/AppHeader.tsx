import React from 'react';
import { Heart } from 'lucide-react';

const AppHeader: React.FC = () => {
    return (
        <div className="mb-12 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
                <div className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
                    <Heart className="h-8 w-8 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-6xl font-bold text-transparent">
                    SoulCast
                </h1>
            </div>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-amber-800">
                依心情尋找心靈的陪伴 🎧
            </p>
        </div>
    );
};

export default AppHeader;
