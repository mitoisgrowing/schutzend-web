import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/* Texto que se escribe letra a letra */
function Escribe({ texto }: { texto: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = window.setInterval(() => setN((v) => (v >= texto.length ? v : v + 1)), 38);
    return () => window.clearInterval(id);
  }, [texto]);
  return (
    <>
      <span>{texto.slice(0, n)}</span>
      <span className="opacity-0">{texto.slice(n)}</span>
    </>
  );
}

/* El bichito: al tocarlo suelta su frase en un bocadillo */
export function Bichito({
  frase,
  className = "",
  style,
  flip = false,
  bocadilloPos = "arriba",
}: {
  frase: string;
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
  bocadilloPos?: "arriba" | "izquierda";
}) {
  const [on, setOn] = useState(false);
  const t = useRef<number | undefined>(undefined);
  const salto = useAnimationControls();
  const hablar = () => {
    setOn(true);
    salto.start({ y: [0, -26, 0, -8, 0], scaleY: [1, 0.85, 1.1, 0.95, 1], transition: { duration: 0.6 } });
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setOn(false), 3000);
  };
  useEffect(() => () => window.clearTimeout(t.current), []);
  /* De vez en cuando pega un saltito para que lo toquen */
  useEffect(() => {
    let id: number;
    const loop = () => {
      id = window.setTimeout(() => {
        salto.start({ y: [0, -16, 0, -5, 0], transition: { duration: 0.55 } });
        loop();
      }, 5000 + Math.random() * 5000);
    };
    loop();
    return () => window.clearTimeout(id);
  }, [salto]);

  return (
    <div className={`absolute z-20 ${className}`} style={style}>
      <AnimatePresence>
        {on && (
          <motion.div
            key="b"
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="bocadillo text-lg md:text-2xl"
            style={
              bocadilloPos === "arriba"
                ? { bottom: "100%", left: "50%", x: "-50%", marginBottom: 14, transformOrigin: "bottom center" }
                : ({ bottom: "75%", right: "70%", marginRight: 6, "--cola": "80%", transformOrigin: "bottom right" } as CSSProperties)
            }
          >
            <Escribe texto={frase} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={hablar}
        animate={salto}
        aria-label={`Bichito: ${frase}`}
        className="block w-full bg-transparent border-0 p-0 origin-bottom"
      >
        <img
          src="/img/bichito.webp"
          alt=""
          draggable={false}
          className="balanceo boil w-full h-auto select-none transition-transform duration-300 hover:scale-110"
          style={flip ? { scale: "-1 1" } : undefined}
        />
      </motion.button>
    </div>
  );
}

/* El bicho azul: alterna dos frames mientras tiene el cursor encima, como si hablara */
export function BichoAzul({ href, className = "" }: { href: string; className?: string }) {
  const [hover, setHover] = useState(false);
  const [frame, setFrame] = useState(0);
  /* Cada pocos segundos habla solo un momento, para que se note que está vivo */
  useEffect(() => {
    let a: number, b: number;
    const loop = () => {
      a = window.setTimeout(() => {
        setHover(true);
        b = window.setTimeout(() => {
          setHover(false);
          loop();
        }, 1500);
      }, 2500 + Math.random() * 4000);
    };
    loop();
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);
  useEffect(() => {
    if (!hover) {
      setFrame(0);
      return;
    }
    const id = window.setInterval(() => setFrame((f) => 1 - f), 170);
    return () => window.clearInterval(id);
  }, [hover]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entra al portfolio"
      className={`interactivo flotar relative block ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => {
        setHover(true);
        window.setTimeout(() => setHover(false), 1800);
      }}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="bocadillo text-base md:text-xl"
            style={{ bottom: "88%", left: "62%", transformOrigin: "bottom left", "--cola": "15%" } as CSSProperties}
          >
            <Escribe texto="¡Entra al portfolio!" />
          </motion.span>
        )}
      </AnimatePresence>
      <img src="/img/bicho-azul-1.webp" alt="" className={`w-full h-auto ${frame ? "invisible" : ""}`} draggable={false} />
      <img
        src="/img/bicho-azul-2.webp"
        alt=""
        className={`absolute inset-0 w-full h-auto ${frame ? "" : "invisible"}`}
        draggable={false}
      />
    </a>
  );
}
