// app/components/ui/Card.tsx
import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-[#11141d] border border-gray-800 rounded-2xl p-6 ${className}`}
  >
    {children}
  </div>
);
