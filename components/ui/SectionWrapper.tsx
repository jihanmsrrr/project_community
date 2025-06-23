// components/ui/SectionWrapper.tsx
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  id,
  "aria-labelledby": labelledby,
  className,
}) => {
  return (
    <section
      id={id}
      aria-labelledby={labelledby}
      className={`w-full py-6 md:py-8 ${className || ""}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
