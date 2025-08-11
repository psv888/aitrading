import React, { useEffect } from 'react';
import { NeumorphicCard, NeumorphicButton } from '../../styles/Neumorphic';
import { useTheme } from '../../context/ThemeContext';

// Simple confetti animation using canvas
const ConfettiBlast = () => {
  useEffect(() => {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const confetti = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100 + 10,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05
    }));
    let angle = 0;
    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      angle += 0.01;
      confetti.forEach(c => {
        c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(angle);
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 5);
        ctx.stroke();
      });
      animationFrame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return <canvas id="confetti-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1000 }} />;
};

const SectionComplete = ({ onComplete }) => {
  const { isLightMode } = useTheme();

  const handleGoToDashboard = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ConfettiBlast />
      <NeumorphicCard isLightMode={isLightMode} style={{ 
        zIndex: 2, 
        position: 'relative', 
        minWidth: 340, 
        minHeight: 320, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem', 
          fontSize: '2rem',
          color: isLightMode ? '#2c3e50' : '#ffffff'
        }}>
          🎉 You're All Set! 🎉
        </h2>
        <div style={{ 
          color: isLightMode ? '#6c757d' : '#ffffff', 
          fontSize: '1.2rem', 
          textAlign: 'center', 
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          You've completed setting up your AI trading preferences.<br />
          Get ready to experience smart, automated investing!
        </div>
        <NeumorphicButton isLightMode={isLightMode} style={{ width: '100%' }} onClick={handleGoToDashboard}>
          Go to Dashboard
        </NeumorphicButton>
      </NeumorphicCard>
    </div>
  );
};

export default SectionComplete; 