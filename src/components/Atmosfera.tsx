import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NOMBRES, href, type Seccion } from "./ui";

/* Color del resplandor / niebla de cada sección */
export const GLOW: Record<Seccion, string> = {
  inicio: "255,205,28",
  "sobre-mi": "255,117,31",
  tienda: "140,120,255",
  canales: "232,51,59",
  contacto: "25,194,107",
  productora: "232,51,59",
  colaboraciones: "36,72,216",
};

/* Cuánta oscuridad deja la linterna fuera del círculo */
const OSCURIDAD: Record<Seccion, number> = {
  inicio: 0.78,
  "sobre-mi": 0.45,
  tienda: 0.55,
  canales: 0.55,
  contacto: 0.5,
  productora: 0.62,
  colaboraciones: 0.55,
};

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Linterna: la página está a oscuras y el cursor (o el dedo) la ilumina ── */
export function Linterna({ s }: { s: Seccion }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      tx = x,
      ty = y,
      last = 0,
      raf = 0;
    const mover = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      last = performance.now();
    };
    const tick = (t: number) => {
      /* Si nadie la mueve, deambula sola */
      if (t - last > 2500) {
        tx = window.innerWidth * (0.5 + 0.32 * Math.sin(t / 2300));
        ty = window.innerHeight * (0.45 + 0.25 * Math.sin(t / 1700 + 1));
      }
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      el.style.setProperty("--lx", `${x}px`);
      el.style.setProperty("--ly", `${y}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerdown", mover);
    if (!reduce()) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", mover);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="linterna"
      style={{ "--osc": OSCURIDAD[s], "--glow": GLOW[s] } as React.CSSProperties}
    />
  );
}

/* ── Niebla de colores que respira + motas de polvo flotando ── */
export function Niebla({ s }: { s: Seccion }) {
  const c = useRef<HTMLCanvasElement>(null);
  const glow = GLOW[s];
  useEffect(() => {
    const cv = c.current!;
    const ctx = cv.getContext("2d")!;
    let w = 0,
      h = 0,
      raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = cv.width = window.innerWidth * dpr;
      h = cv.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const N = window.innerWidth < 768 ? 28 : 55;
    const motas = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      v: 0.00012 + Math.random() * 0.00035,
      f: Math.random() * Math.PI * 2,
      a: 0.15 + Math.random() * 0.5,
    }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motas) {
        m.y -= m.v;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const x = (m.x + Math.sin(t / 3000 + m.f) * 0.015) * w;
        const y = m.y * h;
        const a = m.a * (0.6 + 0.4 * Math.sin(t / 700 + m.f));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${glow},${a})`;
        ctx.arc(x, y, m.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if (!reduce()) raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [glow]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" style={{ "--glow": glow } as React.CSSProperties}>
      <div className="niebla niebla-1" />
      <div className="niebla niebla-2" />
      <canvas ref={c} className="absolute inset-0 h-full w-full mix-blend-screen" />
    </div>
  );
}

/* ── Intro: negro, el ojo se abre y susurra. Solo la primera vez por sesión ── */
export function Intro() {
  const [on, setOn] = useState(() => {
    try {
      return !sessionStorage.getItem("intro-visto");
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (!on) return;
    try {
      sessionStorage.setItem("intro-visto", "1");
    } catch {
      /* sin storage: no pasa nada */
    }
    const id = window.setTimeout(() => setOn(false), 3200);
    return () => window.clearTimeout(id);
  }, [on]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-black"
          onClick={() => setOn(false)}
          exit={{ clipPath: "circle(0% at 50% 45%)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          initial={{ clipPath: "circle(150% at 50% 45%)" }}
        >
          <motion.img
            src="/img/ojo.webp"
            alt=""
            className="w-40 md:w-56 boil"
            initial={{ scaleY: 0.05, opacity: 0 }}
            animate={{ scaleY: [0.05, 0.05, 1, 0.1, 1], opacity: 1 }}
            transition={{ duration: 1.8, times: [0, 0.3, 0.55, 0.65, 0.8] }}
          />
          <motion.p
            className="boil font-hand text-2xl md:text-4xl text-white/80 tracking-widest"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.3, duration: 1 }}
          >
            entra… si te atreves
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Menú de móvil: un ojo arriba a la derecha que abre todas las secciones ── */
const ORDEN: Seccion[] = ["inicio", "sobre-mi", "tienda", "canales", "productora", "colaboraciones", "contacto"];

export function MenuMovil({ s }: { s: Seccion }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [s]);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed right-3 top-3 z-[66] grid h-14 w-14 place-items-center rounded-full bg-black/70 border-2 border-white/20 backdrop-blur"
      >
        {open ? (
          <span className="boil font-hand text-3xl leading-none text-white">✕</span>
        ) : (
          <img src="/img/ojo.webp" alt="" className="w-10 parpadeo" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            className="fixed inset-0 z-[65] flex flex-col items-center justify-center gap-5 bg-black/95"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)", transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div aria-hidden className="absolute inset-0 bg-[url(/img/garabatos.webp)] bg-cover opacity-10 boil-suave" />
            {ORDEN.map((k, i) => (
              <motion.a
                key={k}
                href={href(k)}
                onClick={() => setOpen(false)}
                aria-current={k === s ? "page" : undefined}
                className="btn-amarillo relative text-3xl px-10 py-3"
                initial={{ opacity: 0, x: i % 2 ? 60 : -60, rotate: i % 2 ? 4 : -4 }}
                animate={{ opacity: 1, x: 0, rotate: i % 2 ? 1.5 : -1.5, transition: { delay: 0.15 + i * 0.05, type: "spring", damping: 15 } }}
              >
                {k === "sobre-mi" ? "SOBRE MÍ" : NOMBRES[k]}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Susurros: frases sueltas medio escondidas que solo se ven si te acercas ── */
export function Susurros({ frases }: { frases: { t: string; x: string; y: string; r?: number }[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
      {frases.map((f, i) => (
        <span
          key={i}
          className="susurro absolute font-hand text-lg"
          style={{ left: f.x, top: f.y, rotate: `${f.r ?? 0}deg`, animationDelay: `${i * -1.7}s` }}
        >
          <span className="boil inline-block">{f.t}</span>
        </span>
      ))}
    </div>
  );
}
