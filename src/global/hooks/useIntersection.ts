import { useState, useEffect, useRef } from 'react';

export const useIntersection = (element: any, rootMargin: string): boolean => {
  const [isVisible, setState] = useState(false);
  const elementRef = useRef(element);

  useEffect(() => {
    const { current } = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin },
    );

    current !== null && observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [elementRef.current]);

  return isVisible;
};
