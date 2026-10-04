import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Seccion } from "./components/ui";
import { Intro, MenuMovil } from "./components/Atmosfera";
import { Canales, Colaboraciones, Contacto, Inicio, Productora, ProyectoVista, SobreMi, Tienda } from "./views";
import { PROYECTOS } from "./proyectos";

const VISTAS: Record<Seccion, () => React.JSX.Element> = {
  inicio: Inicio,
  "sobre-mi": SobreMi,
  tienda: Tienda,
  canales: Canales,
  contacto: Contacto,
  productora: Productora,
  colaboraciones: Colaboraciones,
};

const TITULOS: Record<Seccion, string> = {
  inicio: "Schützend",
  "sobre-mi": "Sobre mí · Schützend",
  tienda: "Tienda · Schützend",
  canales: "Canales · Schützend",
  contacto: "Contacto · Schützend",
  productora: "Schützend Productions",
  colaboraciones: "Colaboraciones · Schützend",
};

/* Color de la cortina según la sección a la que entras */
const COLOR: Record<Seccion, [string, string]> = {
  inicio: ["#ffcd1c", "#0a0a0a"],
  "sobre-mi": ["#ff751f", "#2448d8"],
  tienda: ["#6d6aa0", "#ff751f"],
  canales: ["#e8333b", "#ffcd1c"],
  contacto: ["#19c26b", "#e8333b"],
  productora: ["#e8333b", "#0a0a0a"],
  colaboraciones: ["#2448d8", "#ff751f"],
};

type Ruta = { s: Seccion; slug?: string };
const leer = (): Ruta => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  if (h.startsWith("proyecto/")) {
    const slug = h.slice(9);
    if (PROYECTOS.some((p) => p.slug === slug)) return { s: "productora", slug };
  }
  return { s: (h in VISTAS ? h : "inicio") as Seccion };
};

const ease = [0.76, 0, 0.24, 1] as const;

/* Dos capas de papel que barren la pantalla al cambiar de sección */
function Cortina({ s }: { s: Seccion }) {
  const [a, b] = COLOR[s];
  const capa = (bg: string, dIn: number, dOut: number, z: number, ojo = false) => (
    <motion.div
      className="fixed inset-0 pointer-events-none flex items-center justify-center"
      style={{ background: bg, zIndex: z }}
      initial={{ clipPath: "inset(0 0 0 0%)" }}
      animate={{ clipPath: "inset(0 0 0 100%)", transition: { duration: 0.6, ease, delay: dIn } }}
      exit={{ clipPath: "inset(0 0 0 0%)", transition: { duration: 0.45, ease, delay: dOut } }}
    >
      {ojo && <img src="/img/ojo.webp" alt="" className="w-28 md:w-40 boil" />}
    </motion.div>
  );
  return (
    <>
      {capa(b, 0.12, 0, 61)}
      {capa(a, 0.02, 0.1, 62, true)}
    </>
  );
}

/* Línea de progreso arriba: muestra cuánto has bajado en la sección actual */
function Progreso({ ruta }: { ruta: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.style.transform = "scaleX(0)";
    el.style.opacity = "0";
    const on = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!t || !(t instanceof HTMLElement)) return;
      const max = t.scrollHeight - t.clientHeight;
      if (max < 8) return;
      el.style.opacity = "1";
      el.style.transform = `scaleX(${Math.min(1, t.scrollTop / max)})`;
    };
    document.addEventListener("scroll", on, true);
    return () => document.removeEventListener("scroll", on, true);
  }, [ruta]);
  return <div ref={ref} className="progreso" aria-hidden />;
}

function FiltrosBoil() {
  const f = (id: string, seed: number, scale: number) => (
    <filter id={id} key={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={seed} />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      {f("boil-1", 1, 4)}
      {f("boil-2", 7, 4)}
      {f("boil-3", 13, 4)}
      {f("boil-s1", 2, 1.4)}
      {f("boil-s2", 8, 1.4)}
      {f("boil-s3", 14, 1.4)}
    </svg>
  );
}

export default function App() {
  const [ruta, setRuta] = useState<Ruta>(leer);
  const { s, slug } = ruta;

  useEffect(() => {
    const on = () => setRuta(leer());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    document.title = slug ? `${PROYECTOS.find((p) => p.slug === slug)!.titulo} · Schützend Productions` : TITULOS[s];
  }, [s, slug]);

  const V = VISTAS[s];
  return (
    <MotionConfig reducedMotion="user">
      <FiltrosBoil />
      <AnimatePresence mode="wait">
        <motion.div key={slug ?? s} exit={{ opacity: 1, transition: { duration: 0.6 } }}>
          {slug ? <ProyectoVista slug={slug} /> : <V />}
          <Cortina s={s} />
        </motion.div>
      </AnimatePresence>
      <Progreso ruta={slug ?? s} />
      <MenuMovil s={s} />
      <Intro />
      <div className="vineta" />
      <div className="grano" />
    </MotionConfig>
  );
}
