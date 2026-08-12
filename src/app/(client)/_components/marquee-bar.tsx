"use client";

interface MarqueeBarProps {
  text: string;
}

export const MarqueeBar = ({ text }: MarqueeBarProps) => {
  return (
    <div className="w-full overflow-hidden bg-secondary py-1.5">
      <div className="flex w-max animate-marquee gap-16">
        <div className="flex shrink-0 items-center gap-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-xs font-medium text-background"
            >
              {text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-16" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-xs font-medium text-background"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
