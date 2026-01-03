import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
}

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    decimals = 0
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        const startValue = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = startValue + (end - startValue) * easeOutQuart;

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    const formatNumber = (num: number) => {
        return num.toLocaleString('pt-MZ', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    return (
        <span ref={counterRef} className="font-bold">
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
}
