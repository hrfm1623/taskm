import { useRef, useState } from "react";
import type { ReactElement } from "react";

interface CardHoverEffectProps {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export function CardHoverEffect({
  children,
  className = "",
  isInteractive = true,
}: CardHoverEffectProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !isInteractive) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={divRef}
      className={`group relative rounded-xl p-[1px] transition-all ${
        isInteractive ? "cursor-pointer" : ""
      } ${
        isHovered
          ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          : "bg-slate-800"
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-xl bg-slate-900 p-4 transition-all group-hover:bg-slate-800">
        <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm"
            style={{
              maskImage:
                "radial-gradient(var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0.7) 20%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0.7) 20%, transparent 80%)",
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
