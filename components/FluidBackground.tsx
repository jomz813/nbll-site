
import React from 'react';

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* Animated Blobs - Intensified Reds */}
      <div 
        className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] bg-[#D60A07] rounded-full mix-blend-screen filter blur-[120px] animate-pulse opacity-30"
        style={{ animationDuration: '10s' }}
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#FF0000] rounded-full mix-blend-screen filter blur-[150px] animate-bounce opacity-25"
        style={{ animationDuration: '15s' }}
      />
      <div 
        className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] bg-[#8B0000] rounded-full mix-blend-screen filter blur-[180px] opacity-40 animate-pulse"
        style={{ animationDuration: '12s' }}
      />
      <div 
        className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] bg-[#D60A07] rounded-full mix-blend-screen filter blur-[140px] opacity-20 animate-bounce"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Central focus mask to keep text legible */}
      <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-[#000] rounded-full filter blur-[120px] opacity-90" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70" />
    </div>
  );
};

export default FluidBackground;
