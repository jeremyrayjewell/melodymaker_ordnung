import React, { useState, useEffect } from 'react';

const AnimatedAsciiArt = ({ asciiLines }) => {
  
  const [charOffsets, setCharOffsets] = useState(
    // Initialize with empty arrays for each line
    Array.from({ length: asciiLines.length }, () => [])
  );
  
  useEffect(() => {
    const amplitude = 0.7;  // Reduced amplitude to prevent overlap
    const speed = 0.0007;   // Slightly slower animation
    const wavelength = 20; 
    
    let animationFrameId;
    let startTime = Date.now();
    
    // Animation function
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Calculate new vertical offsets for each character
      const newOffsets = asciiLines.map((line) => {
        return Array.from({ length: line.length }, (_, charIndex) => {
          // Calculate sin wave offset based on position and time
          const phase = (charIndex / wavelength) - (elapsed * speed);
          return Math.sin(phase * 2 * Math.PI) * amplitude;
        });
      });
      
      setCharOffsets(newOffsets);
      animationFrameId = requestAnimationFrame(animate);
    };
      animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [asciiLines]);    return (
    <div className="animated-ascii-container" style={{ 
      fontFamily: "'Px437_IBM_EGA8', 'DOS', monospace",
      background: "transparent",  // Transparent background
      color: "#aaaaaa",
      padding: "0",
      whiteSpace: "pre",
      overflow: "visible",
      lineHeight: "1",
      fontSize: "10px", // Fixed exact pixel size
      textAlign: "center",
      width: "100%",
      margin: "0 auto",
      transform: "none" // Prevent transforms from affecting the container
    }}>      {asciiLines.map((line, lineIndex) => (
        <div key={lineIndex} className="ascii-line" style={{ 
          marginBottom: "0", 
          height: "10px", 
          lineHeight: "10px",
          fontSize: "10px"
        }}>
          {line.split('').map((char, charIndex) => {
            // Don't animate spaces and special characters
            const offset = char.trim() === '' ? 0 : (charOffsets[lineIndex][charIndex] || 0);
              return (              <span
                key={charIndex}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${offset}px)`,
                  background: "transparent", // Ensure each character has transparent background
                  fontSize: "10px", // Fixed exact size
                  lineHeight: "1",
                  fontFamily: "inherit",
                  width: "auto",
                  height: "auto"
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AnimatedAsciiArt;
