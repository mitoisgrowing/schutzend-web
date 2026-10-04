import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties, PointerEvent } from "react";

export type Seccion =
  | "inicio"
  | "sobre-mi"
  | "tienda"
  | "canales"
  | "contacto"
  | "productora"
  | "colaboraciones";

export const NOMBRES: Record<Seccion, string> = {
  inicio: "INICIO",
  "sobre-mi": "SCHÜTZEND",
  tienda: "TIENDA",
  canales: "CANALES",
  contacto: "CONTACTO",
  productora: "PRODUCTORA",
  colaboraciones: "COLABORACIONES",
};

export const href = (s: Seccion) => (s === "inicio" ? "#" : `#${s}`);

/* Aparición escalonada */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
export const pop: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 200, damping: 22, filter: { duration: 0.45 } },
  },
};

const rot = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return ((h % 5) - 2) * 0.6;
};

export function Boton({
  to,
  className = "",
  big = false,
  current = false,
  children,
}: {
  to: Seccion;
  className?: string;
  big?: boolean;
  current?: boolean;
  children?: ReactNode;
}) {
  const r = rot(to);
  return (
    <motion.div variants={pop} className="inline-block">
      <a
        href={href(to)}
        aria-current={current ? "page" : undefined}
        className={`btn-amarillo interactivo ${big ? "text-4xl md:text-6xl px-10 py-4" : "text-base md:text-2xl md:px-7"} ${className}`}
        style={{ "--rot": `${r}deg` } as CSSProperties}
      >
        {children ?? NOMBRES[to]}
      </a>
    </motion.div>
  );
}

/* Barra superior: botones a los lados y el título de la sección en medio */
export function Nav({
  left,
  right,
  title,
  extra,
}: {
  left: Seccion[];
  right: Seccion[];
  title?: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <motion.nav
      variants={stagger}
      className="relative z-20 flex flex-wrap items-center justify-center md:justify-between gap-2 md:gap-4 px-16 md:px-8 pt-5 md:pt-5"
    >
      <div className="hidden md:flex gap-5 flex-wrap justify-center">
        {left.map((s) => (
          <Boton key={s} to={s} />
        ))}
      </div>
      {title && <Titulo>{title}</Titulo>}
      <div className="hidden md:flex gap-5 flex-wrap justify-center items-start">
        {right.map((s) => (
          <Boton key={s} to={s} />
        ))}
        {extra}
      </div>
    </motion.nav>
  );
}

/* Título que se redibuja sin parar, con un garabato naranja que se dibuja debajo */
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1
      variants={pop}
      className={`relative order-first md:order-none w-full md:w-auto text-center font-serif font-bold text-4xl md:text-6xl tracking-wide ${className}`}
    >
      <span className="glitch inline-block"><span className="boil inline-block">{children}</span></span>
      <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden className="boil absolute left-1/2 -translate-x-1/2 -bottom-2 w-[min(90%,16rem)] h-4 overflow-visible">
        <motion.path
          d="M4 12 C 60 4, 110 18, 160 9 S 250 4, 296 11"
          fill="none"
          stroke="var(--color-naranja)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeInOut" }}
        />
      </svg>
    </motion.h1>
  );
}

/* Inclinación 3D siguiendo el cursor */
function useTilt(on: boolean) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  if (!on) return {};
  return {
    style: { rotateX: rx, rotateY: ry, transformPerspective: 800 },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
      rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
    },
    onPointerLeave: () => {
      rx.set(0);
      ry.set(0);
    },
  };
}

/* Enlace externo; si el enlace está pendiente (null) se renderiza sin enlace */
export function Ext({
  url,
  className = "",
  children,
  label,
  tilt = false,
  rot,
  wrap = "",
}: {
  url: string | null;
  className?: string;
  children: ReactNode;
  label?: string;
  tilt?: boolean;
  rot?: number;
  wrap?: string;
}) {
  const t = useTilt(tilt);
  const st = (rot !== undefined ? { "--rot": `${rot}deg` } : {}) as CSSProperties;
  const cls = `interactivo ${rot !== undefined ? "collage" : ""} ${className}`;
  if (!url)
    return (
      <motion.div variants={pop} className={wrap} {...t}>
        <div className={cls} style={st} title="Enlace próximamente">
          {children}
        </div>
      </motion.div>
    );
  const isMail = url.startsWith("mailto:") || url.startsWith("#");
  return (
    <motion.div variants={pop} className={wrap} {...t}>
      <a
        href={url}
        aria-label={label}
        style={st}
        className={`block ${cls}`}
        {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    </motion.div>
  );
}

/* Decoración: sin hover, sin interacción */
export function Deco({ src, className = "", style }: { src: string; className?: string; style?: CSSProperties }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none select-none absolute ${className}`}
      style={style}
    />
  );
}

export function Vista({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      exit={{ opacity: 1, transition: { duration: 0.6 } }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
      className={`relative h-dvh w-full overflow-x-hidden overflow-y-auto md:overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </motion.main>
  );
}

export const IconoInsta = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <defs>
      <radialGradient id="ig" cx="30%" cy="107%" r="150%">
        <stop offset="0" stopColor="#fdf497" />
        <stop offset=".05" stopColor="#fdf497" />
        <stop offset=".45" stopColor="#fd5949" />
        <stop offset=".6" stopColor="#d6249f" />
        <stop offset=".9" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="none" stroke="url(#ig)" strokeWidth="2.4" />
    <circle cx="12" cy="12" r="4.8" fill="none" stroke="url(#ig)" strokeWidth="2.4" />
    <circle cx="17.6" cy="6.4" r="1.4" fill="#d6249f" />
  </svg>
);

export const IconoMail = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 18" className={className} aria-hidden>
    <rect x="1" y="1" width="22" height="16" rx="2" fill="#e8f1ff" />
    <path d="M1 3v14h4V7l7 5.2L19 7v10h4V3l-2-2-9 6.8L3 1z" fill="#ea4335" />
  </svg>
);
