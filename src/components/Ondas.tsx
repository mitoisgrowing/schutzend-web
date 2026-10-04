import { useEffect, useRef } from "react";

/* Fondo de la tienda: bandas negras y grises que ondulan como tela */
export function Ondas({ bandas = 22 }: { bandas?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll("path"));
    const W = 1600;
    const H = 1000;
    const N = 48;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const y0 = (i: number) => 230 + (i / bandas) * (H - 230);

    const linea = (i: number, t: number) => {
      const pts: string[] = [];
      for (let k = 0; k <= N; k++) {
        const x = (k / N) * W;
        const amp = 55 + 25 * Math.sin(i * 0.35 + t * 0.4);
        const y =
          y0(i) +
          amp * Math.sin(x / 260 + t * 0.9 + i * 0.18) +
          18 * Math.sin(x / 90 - t * 1.3 + i * 0.5);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return pts;
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      for (let i = 0; i < paths.length; i++) {
        const top = linea(i, t);
        const bot = linea(i + 1, t).reverse();
        paths[i].setAttribute("d", `M${top.join("L")}L${bot.join("L")}Z`);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(0);
    if (!reduce) raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [bandas]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <rect x="0" y="0" width="1600" height="1000" fill="transparent" />
      {Array.from({ length: bandas + 4 }, (_, i) => (
        <path key={i} fill={i % 2 ? "#34343f" : "#0b0b0e"} />
      ))}
    </svg>
  );
}
