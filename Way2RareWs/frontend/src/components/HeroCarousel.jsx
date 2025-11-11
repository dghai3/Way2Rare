import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

const Dot = ({ selected, onClick }) => (
  <button
    onClick={onClick}
    className={`h-2 w-2 rounded-full transition-all ${
      selected ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
    }`}
    aria-label="Go to slide"
  />
);

const Arrow = ({ dir = "prev", onClick }) => (
  <button
    onClick={onClick}
    className="grid place-items-center h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white
               transition disabled:opacity-40 disabled:cursor-not-allowed"
    aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
  >
    {dir === "prev" ? "‹" : "›"}
  </button>
);

export default function HeroCarousel({
  slides = [],
  loop = true,
  delayMs = 4500,
  className = "",
}) {
  const autoplay = useRef(Autoplay({ delay: delayMs, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // pause on hover
  const onMouseEnter = () => autoplay.current?.stop();
  const onMouseLeave = () => autoplay.current?.play();

  const scrollTo = (i) => emblaApi && emblaApi.scrollTo(i);
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* viewport */}
      <div className="embla" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] relative">
  {/* media */}
  <div className="relative aspect-[16/9] w-full">  {/* ✅ locked to 16:9 */}
    {s.type === "video" ? (
      <video
        src={s.src}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        src={s.src}
        alt={s.alt || ""}
        className="h-full w-full object-cover"
        loading="eager"
      />
    )}

    {/* overlay content */}
    {s.headline || s.cta ? (
      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="p-6 sm:p-12">
          <div className="max-w-xl">
            {s.kicker && (
              <p className="uppercase tracking-widest text-xs sm:text-sm text-white/80 mb-2">
                {s.kicker}
              </p>
            )}
            {s.headline && (
              <h2 className="text-white text-3xl sm:text-5xl font-semibold leading-tight drop-shadow">
                {s.headline}
              </h2>
            )}
            {s.subhead && (
              <p className="text-white/90 mt-3 sm:text-lg">{s.subhead}</p>
            )}
            {s.cta && (
              <Link
                to={s.cta.href}
                className="inline-block mt-5 px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-white/90 transition"
              >
                {s.cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    ) : null}
  </div>
</div>

          ))}
        </div>
      </div>

      {/* controls */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 sm:px-4">
        <div className="pointer-events-auto">
          <Arrow dir="prev" onClick={scrollPrev} />
        </div>
        <div className="pointer-events-auto">
          <Arrow dir="next" onClick={scrollNext} />
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, i) => (
            <Dot key={i} selected={i === selectedIndex} onClick={() => scrollTo(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
