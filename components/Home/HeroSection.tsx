import Image from "next/image";
import GreetingSearch from "./greetingSearch";
import Carousel from "./Carousel";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full rounded-xl overflow-visible">
      {/* Backdrop dengan tinggi 85vh dan full rounded */}
      <div className="absolute top-0 left-0 right-0 h-[78vh] rounded-3xl overflow-hidden z-0">
        <Image
          src="/backdrop.png"
          alt="Backdrop"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-3xl"
          priority
        />
        <div className="absolute inset-0 rounded-3xl bg-black/10" />
      </div>

      {/* Konten utama dengan jarak antar elemen dikurangi */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 pt-8 pb-2 flex flex-col items-center gap-6">
        {/* GreetingSearch */}
        <div className="w-full max-w-lg">
          <GreetingSearch />
        </div>

        {/* Carousel */}
        <div className="w-full max-w-[900px] overflow-visible">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
