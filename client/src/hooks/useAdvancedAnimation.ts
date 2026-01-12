import { useEffect, useRef, useState } from 'react';

export type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';

interface UseAdvancedAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  animationType?: AnimationType;
  duration?: number;
}

export function useAdvancedAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseAdvancedAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    animationType = 'fadeIn',
    duration = 0.6,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  // Apply animation classes
  useEffect(() => {
    if (!ref.current) return;

    if (isVisible) {
      const animationClass = `animate-${animationType}`;
      ref.current.style.animation = `${animationType} ${duration}s ease-out ${delay}s forwards`;
      ref.current.classList.add('animated');
    }
  }, [isVisible, animationType, duration, delay]);

  return { ref, isVisible };
}

export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: UseAdvancedAnimationOptions = {}
) {
  const { delay = 0.1, ...rest } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: rest.threshold || 0.1, rootMargin: rest.rootMargin || '0px' }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rest.threshold, rest.rootMargin]);

  // Apply staggered animations to children
  useEffect(() => {
    if (!isVisible || !ref.current) return;

    const children = ref.current.querySelectorAll('[data-stagger]');
    children.forEach((child, index) => {
      const element = child as HTMLElement;
      const staggerDelay = index * delay;
      element.style.animation = `slideUp 0.6s ease-out ${staggerDelay}s forwards`;
      element.style.opacity = '0';
    });
  }, [isVisible, delay]);

  return { ref, isVisible };
}
