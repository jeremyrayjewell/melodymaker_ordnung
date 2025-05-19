import React, { useRef, useEffect, useState } from "react";

export default function TransparentWaveOverlay({ audioCtx, analyser }) {
  const canvasRef = useRef(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
    useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Set canvas size based on parent container size for better responsiveness
        const parentElement = canvasRef.current.parentElement;
        if (parentElement) {
          canvasRef.current.width = parentElement.clientWidth;
          canvasRef.current.height = parentElement.clientHeight || window.innerHeight;
        } else {
          // Fallback to window dimensions if no parent
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      }
    };

    
    handleResize();
    
    // Handle resize events to maintain responsiveness
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "rgb(0, 255, 255)";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    
  }, []);  
  useEffect(() => {
    if (!audioCtx || !analyser) return;
    
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    const canvas = canvasRef.current;
    
    
    
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: true, 
      desynchronized: true 
    });
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    
    let silenceCounter = 0;
    const SILENCE_THRESHOLD = 0.01; 
    const MAX_SILENCE_FRAMES = 10; 
    
    
    const draw = () => {
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      
      analyser.getByteTimeDomainData(dataArray);
      
      
      let hasAudioActivity = false;
      for (let i = 0; i < bufferLength; i++) {
        const normalizedValue = Math.abs((dataArray[i] / 128.0) - 1.0);
        if (normalizedValue > SILENCE_THRESHOLD) {
          hasAudioActivity = true;
          silenceCounter = 0;
          break;
        }
      }
      
      
      if (!hasAudioActivity) {
        silenceCounter++;
        if (silenceCounter >= MAX_SILENCE_FRAMES) {
          setIsAudioActive(false);
        }
      } else {
        setIsAudioActive(true);
      }
      ctx.lineWidth = 4; 
      ctx.strokeStyle = "rgb(255, 255, 0)"; 
      
      
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255, 255, 0, 0.8)";
        
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
    
    
    return () => {
      
      cancelAnimationFrame(draw);
    };
  }, [audioCtx, analyser]);  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100%", 
        height: "100%",
        maxWidth: "100vw",
        maxHeight: "100vh",
        zIndex: 9999, 
        pointerEvents: "none", 
        backgroundColor: "transparent", 
        mixBlendMode: "lighten", 
        opacity: isAudioActive ? 1 : 0,
        transition: "opacity 0.5s ease-in-out" 
      }}
    />
  );
}
