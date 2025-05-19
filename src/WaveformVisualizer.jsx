import React, { useRef, useEffect, useState } from "react";
import bgImage from './bg.png.png'; 

export default function WaveformVisualizer({ audioCtx, analyser }) {
  
  const backgroundCanvasRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  
  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      setBackgroundImage(img);
    };
  }, []);  
  useEffect(() => {
    const handleResize = () => {
      if (backgroundCanvasRef.current) {
        // Set canvas size based on parent container size for better responsiveness
        const parentElement = backgroundCanvasRef.current.parentElement;
        if (parentElement) {
          backgroundCanvasRef.current.width = parentElement.clientWidth;
          backgroundCanvasRef.current.height = parentElement.clientHeight || window.innerHeight;
        } else {
          // Fallback to window dimensions if no parent
          backgroundCanvasRef.current.width = window.innerWidth;
          backgroundCanvasRef.current.height = window.innerHeight;
        }
      }
    };

    
    handleResize();
    
    // Handle resize events to maintain responsiveness
    window.addEventListener('resize', handleResize);
    
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  useEffect(() => {
    if (!audioCtx || !analyser) return;

    
    const canvas = backgroundCanvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    
    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      
      ctx.fillStyle = "rgba(10, 124, 218, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      
      if (backgroundImage) {
        
        const imgWidth = backgroundImage.width;
        const imgHeight = backgroundImage.height;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = imgWidth / imgHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (canvasRatio > imgRatio) {
          
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }
        
        
        ctx.globalAlpha = 0.3;
        ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0; 
      }
      
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; 
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      
      requestAnimationFrame(draw);
    };
    
    
    draw();
    
  }, [audioCtx, analyser, backgroundImage]);
  return (
    <canvas
      ref={backgroundCanvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        maxWidth: "100vw",
        maxHeight: "100vh",
        objectFit: "cover"
      }}
    />
  );
}