import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHashElement = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if(hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ 
            behavior: 'smooth'
          })
        }, 300);
      } 
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [hash]);
};

export default ScrollToHashElement;