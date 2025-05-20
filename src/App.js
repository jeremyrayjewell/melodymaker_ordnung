import React, { useState, useEffect } from "react";
import MusicalBigO from "./MusicalBigO";
import WaveformVisualizer from "./WaveformVisualizer";
import TransparentWaveOverlay from "./TransparentWaveOverlay";
import AnimatedAsciiArt from "./AnimatedAsciiArt";
import { 
  footerAsciiArt1, footerAsciiArt2, footerAsciiArt3,
  footerAsciiArt1b, footerAsciiArt1c 
} from './asciiFooter';

function App() {  const [audioCtx, setAudioCtx] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 666);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 415);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 2048;
    setAudioCtx(ctx);
    setAnalyser(analyserNode);
    
    // Apply the DOS theme to body
    document.body.setAttribute("data-bs-theme", "dos");    // Add resize listener for responsive ASCII art
    const handleResize = () => {
      setIsMobile(window.innerWidth < 666);
      setIsSmallMobile(window.innerWidth < 415);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <div className="container-fluid dosbox" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: 0, margin: 0 }}>
      {/* Everything must be wrapped inside this outermost div with transparent background */}
      <div className="row mb-3" style={{ margin: 0 }}>
        <div className="col-12 text-center">          {/* ASCII Art with React-based wave animation */}          <div className="ascii-art-container">
            <pre style={{ fontSize: "clamp(6px, 1vw, 10px)", color: "white", padding: "0" }}>
              <AnimatedAsciiArt 
                asciiLines={[
                  "         ######                                                                                       ### ",
                  "      ##############  ################### ###################   ##########    ####################   ##################    #########    ############## ",
                  "    ######     #######  #######     ######  #######    ######## ##########      ####     ######         ####  ##########     ####     ################# ",
                  "  ######         ######  #####       ######  #####         ###### ##########    ####      #####         ####   ##########    ####    #####         ##### ",
                  "######          ###### #####       #####   #####          ##### #### ######   ####      #####         ####   #### ######   ####   ######           # ",
                  "   ######           ###### ################    #####          ##### ####   ######  ###      #####         ####   ####   ###### ####   ######            ### # ",
                  "   ######           ###### #############       #####          ##### ####    ##########      #####         ####   ####     #########   #####       ########### ",
                  "   #######          ###### #####   ######      #####          ##### ####     #########      #####         ####   ####      ########   ######        ###### ## ",
                  " ######          #####  #####    ######     #####         #####  ####       #######      #####         ###    ####      ########   ######        ###### ",
                  "  ######       ######  ######     #######   ######      #######  ####        ######       ######     #####    ####        ######    ######       ###### ",
                  "   #############################   ########################## ##########      #####       ################ ##########      #####     ################# ",
                  "##########     ##########          ##############         #######         ##          ##########      #####            ##       ########"
                ]} 
              />
            </pre>
          </div>

          <h1>Musical Big-O <span className="blink">_</span></h1>
        </div>
      </div>
        {/* Main App content */}
      <div className="App" style={{ position: "relative", width: "100%", height: "100%", margin: 0, padding: 0 }}>
        {audioCtx && analyser && (
          <>
            {/* Background visualization */}
            <WaveformVisualizer audioCtx={audioCtx} analyser={analyser} />
          </>
        )}
        <MusicalBigO audioCtx={audioCtx} analyser={analyser} />
        {/* Transparent overlay waveform - placed in the same container for proper positioning */}
        {audioCtx && analyser && (
          <TransparentWaveOverlay audioCtx={audioCtx} analyser={analyser} />
        )}      
      </div>      {/* ASCII art displays */}        <div className="ascii-art-container">
        <pre className="ascii-art">
          {(isSmallMobile ? footerAsciiArt1b : (isMobile ? footerAsciiArt1c : footerAsciiArt1)).map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </pre>
      </div>

      {!isMobile && (
        <>
          <div className="ascii-art-container">
            <pre style={{ fontSize: "clamp(2px, 0.4vw, 4px)" }}>
              {footerAsciiArt2.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </pre>
          </div>

          <div className="ascii-art-container">
            <pre style={{ fontSize: "clamp(2px, 0.4vw, 4px)" }}>
              {footerAsciiArt3.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
