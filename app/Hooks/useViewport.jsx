import {useEffect, useState, useRef} from 'react';

export function useViewport() {
  // Initialize the 'Viewport' state using useState
  const [Viewport, setViewport] = useState(() => {
    // Use window.innerWidth if available, or a default value
    return typeof window !== 'undefined' ? window.innerWidth : 990;
  });

  // Create a ref using useRef to store the value across renders
  const ViewportRef = useRef(Viewport);

  useEffect(() => {
    // Function to check the viewport
    const checkViewport = () => {
      const viewport = window.innerWidth;
      return viewport;
    };

    // Update the 'Viewport' state and the ref value
    const handleResize = () => {
      const newViewport = checkViewport();
      setViewport(newViewport);
      ViewportRef.current = newViewport;
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize to update the values
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once, on mount
  // console.log('Viewport:', Viewport);
  return Viewport; // Return the value of 'Viewport'
}
