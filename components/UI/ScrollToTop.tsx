import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed right-6 bottom-6 z-50 cursor-pointer rounded-full bg-amber-500 p-3 text-white shadow-lg transition-opacity ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="回到頂部"
        >
            <ArrowUp className="h-6 w-6" />
        </button>
    );
};

export default ScrollToTop;
