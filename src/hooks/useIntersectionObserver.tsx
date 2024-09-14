import { MutableRefObject, useEffect, useState } from 'react';

const useIntersectionObserver = (ref: MutableRefObject<HTMLElement | null>, options: IntersectionObserverInit = {}) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.75, ...options },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [options, ref]);

    return isInView;
};

export default useIntersectionObserver;
