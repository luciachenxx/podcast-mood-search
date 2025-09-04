import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="mx-auto mb-12 max-w-3xl">
            <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 blur-lg" />
                <div className="relative rounded-2xl border border-amber-100 bg-white shadow-xl">
                    <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-amber-400" />
                    <input
                        type="text"
                        placeholder="描述你現在的心情，例如：心情不好、想學習、壓力大..."
                        value={value}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-transparent py-6 pr-8 pl-16 text-lg text-amber-900 placeholder-amber-400 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
