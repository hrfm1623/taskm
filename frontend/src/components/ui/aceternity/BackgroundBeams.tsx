import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

interface BackgroundBeamsProps {
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundBeams({
  children,
  className = "",
}: BackgroundBeamsProps): ReactElement {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beamsRef.current) return;

    const beams = beamsRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = beams.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      beams.style.setProperty("--mouse-x", `${mouseX}px`);
      beams.style.setProperty("--mouse-y", `${mouseY}px`);
    };

    beams.addEventListener("mousemove", handleMouseMove);
    return () => beams.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={`relative min-h-screen overflow-hidden bg-slate-950 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[40rem] w-[90rem] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[40rem] w-[90rem] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-3xl" />
        <div
          className="absolute left-[var(--mouse-x,50%)] top-[var(--mouse-y,50%)] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30 blur-3xl transition-all duration-300"
          style={{ opacity: 0.2 }}
        />
      </div>
      {children}
    </div>
  );
}
