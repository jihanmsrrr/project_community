// components/ui/PageTitle.tsx
import Image from "next/image";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundImageAlt = "",
  titleClassName = "text-white dark:text-gray-100",
  subtitleClassName = "text-gray-200 dark:text-gray-300 mt-1 sm:mt-2 text-base md:text-lg",
}) => {
  return (
    <div className="relative w-full h-auto flex flex-col items-center justify-center text-center py-4 sm:py-6">
      {backgroundImage && (
        <div className="absolute top-1/2 left-1/2 w-28 sm:w-32 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt}
            width={128}
            height={72}
          />
        </div>
      )}

      <h1
        className={`relative z-10 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight px-2 
                   max-w-none sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 
                   ${titleClassName} 
                   tracking-normal sm:tracking-wide md:tracking-wider`} // <-- PERUBAHAN DI SINI
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`relative z-10 ${subtitleClassName} max-w-xl lg:max-w-2xl mx-auto`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
