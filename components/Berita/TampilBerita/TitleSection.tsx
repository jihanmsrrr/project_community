import React from "react";

interface TitleSectionProps {
  text: string;
  // Optional tambahan class untuk custom styling kalau perlu
  containerClassName?: string;
  titleClassName?: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({
  text,
  containerClassName = "",
  titleClassName = "",
}) => {
  return (
    <div className={`mt-5 ${containerClassName}`}>
      <h2 className={`text-lg text-gray-800 ${titleClassName}`}>{text}</h2>
    </div>
  );
};

export default TitleSection;
