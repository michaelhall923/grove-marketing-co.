import React, { useEffect, useRef, useState } from 'react';

const ScrollShow = ({ children }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current); // optional: stop observing once visible
        }
      },
      {
        threshold: 0.1, // trigger when 10% of it is visible
      }
    );

    const element = ref.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      {isVisible && children}
    </div>
  );
};

export default ScrollShow;
