import { useState, useEffect, useRef } from 'react';

export const useImageLazyLoad = (imageUrl?: string) => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!imageUrl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setImageLoaded(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => observer.disconnect();
    }, [imageUrl]);

    return { imageRef, imageLoaded };
};
