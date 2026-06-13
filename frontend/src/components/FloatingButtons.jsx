import React, { useState, useEffect } from "react";


export default function FloatingButtons() {
  const [scrollProgress, setScrollProgress] = useState(0);
 

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-100 bg-transparent">
        <div 
          className="h-full bg-primary shadow-[0_0_10px_rgba(50,205,50,0.8)]" 
          style={{ width: `${scrollProgress * 100}%` }} 
        />
      </div>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        
      
      </div>
    </>
  );
}
