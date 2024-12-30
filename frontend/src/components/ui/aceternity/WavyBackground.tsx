import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function WavyBackground({
  children,
  className = "",
}: WavyBackgroundProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e293b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const waves = 5;
      const amplitude = 50;
      const frequency = 0.01;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 1) {
        let y = canvas.height;
        for (let i = 0; i < waves; i++) {
          y +=
            Math.sin(x * frequency + time + i * Math.PI) *
            amplitude *
            Math.sin(time * 0.5);
        }
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = "rgba(30, 41, 59, 0.5)";
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full opacity-50" />
      {children}
    </div>
  );
}
