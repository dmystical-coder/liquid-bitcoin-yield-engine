import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Centers content and applies responsive paddings & max-widths.
 */
export default function ResponsiveContainer({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[900px] xl:max-w-[1100px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
