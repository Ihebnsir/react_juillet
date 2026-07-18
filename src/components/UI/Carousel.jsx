import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Carousel({ children, itemsPerPage = 4 }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pagesCount = useMemo(() => {
    const total = Array.isArray(children) ? children.length : 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  }, [children, itemsPerPage]);

  const getIsRTL = () => {
    if (typeof document === "undefined") return false;
    const dir = document.documentElement?.dir;
    return dir === "rtl";
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // Mapping pageIndex => scrollLeft (gère aussi le RTL)
  const scrollToPage = (pageIndex) => {
    const container = scrollRef.current;
    if (!container) return;

    const safePageIndex = clamp(pageIndex, 0, pagesCount - 1);

    const totalScrollableWidth = container.scrollWidth - container.clientWidth;
    const pageWidth = totalScrollableWidth / Math.max(1, pagesCount - 1);

    // En LTR: left = pageWidth * i
    // En RTL: les comportements varient; on force en utilisant pageWidth * i sur scrollTo
    // Les navigateurs modernes supportent généralement scrollLeft négatif en RTL.
    const isRTL = getIsRTL();

    const left = isRTL
      ? -pageWidth * safePageIndex
      : pageWidth * safePageIndex;

    container.scrollTo({ left, behavior: "smooth" });
    setActiveIndex(safePageIndex);
  };

  const goToPrev = () => scrollToPage(activeIndex - 1);
  const goToNext = () => scrollToPage(activeIndex + 1);

  // Met à jour l'indicateur actif si l'utilisateur scrolle manuellement (souris/tactile)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isRTL = getIsRTL();
    const totalScrollableWidth = container.scrollWidth - container.clientWidth;
    const pageWidth = totalScrollableWidth / Math.max(1, pagesCount - 1);

    const handleScroll = () => {
      const raw = container.scrollLeft;
      const progress = pageWidth === 0 ? 0 : raw / pageWidth;
      const current = isRTL ? -progress : progress;
      const rounded = clamp(Math.round(current), 0, pagesCount - 1);
      setActiveIndex(rounded);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pagesCount]);

  return (
    <div className="relative">
      {/* Flèche gauche */}
      {activeIndex > 0 && (
        <button
          onClick={goToPrev}
          className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20
                     w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg
                     flex items-center justify-center hover:scale-105 transition"
          aria-label="Précédent"
        >
          <FiChevronLeft size={20} />
        </button>
      )}

      {/* Piste défilante */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[280px] md:w-[300px]"
              >
                {child}
              </div>
            ))
          : children}
      </div>

      {/* Flèche droite */}
      {activeIndex < pagesCount - 1 && (
        <button
          onClick={goToNext}
          className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20
                     w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg
                     flex items-center justify-center hover:scale-105 transition"
          aria-label="Suivant"
        >
          <FiChevronRight size={20} />
        </button>
      )}

      {/* Indicateur pilule + points */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: pagesCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none
              ${
                i === activeIndex
                  ? "w-8 bg-gradient-to-r from-accent-500 to-brand-500"
                  : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
              }`}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;

