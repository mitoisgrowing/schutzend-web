import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Boton, Deco, Ext, IconoInsta, IconoMail, Nav, Vista, pop, stagger } from "./components/ui";
import { BichoAzul, Bichito } from "./components/Bichos";
import { Ondas } from "./components/Ondas";
import { Susurros } from "./components/Atmosfera";
import { LINKS, ig } from "./links";
import { PROYECTOS } from "./proyectos";

const Fosfo = ({ children, c, d }: { children: ReactNode; c?: string; d?: number }) => (
  <mark className="fosfo text-inherit" style={{ "--fosfo": c, "--d": `${d ?? 0.9}s` } as CSSProperties}>
    {children}
  </mark>
);

/* Entrada al hacer scroll (pantallas 2 y 3 de la productora) */
const enVista = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.3 },
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } } as Variants,
} as const;

/* ───────────── 1. PORTADA ───────────── */
const letra: Variants = {
  hidden: { y: -80, opacity: 0, rotate: -20 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 380, damping: 14, delay: 0.55 + i * 0.06 },
  }),
};

export function Inicio() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -24);
  const bgY = useTransform(sy, (v) => v * -24);
  const fgX = useTransform(sx, (v) => v * 10);
  const fgY = useTransform(sy, (v) => v * 10);
  const ojoX = useTransform(sx, (v) => v * 40);
  const ojoY = useTransform(sy, (v) => v * 24);

  useEffect(() => {
    const m = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [mx, my]);

  return (
    <Vista className="bg-black md:overflow-hidden">
      <Susurros frases={[{t:"¿qué miras?",x:"8%",y:"14%",r:-8},{t:"aquí no hay nada",x:"76%",y:"82%",r:5},{t:"sigue buscando",x:"82%",y:"12%",r:7}]} />
      <motion.div
        aria-hidden
        className="absolute -inset-10 bg-cover bg-center boil-suave"
        style={{ backgroundImage: "url(/img/garabatos.webp)", x: bgX, y: bgY }}
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.55),transparent_65%)]" />
      <motion.div
        style={{ x: fgX, y: fgY }}
        className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-10 md:gap-14 px-4 py-16"
      >
        <div className="relative">
          <motion.div
            aria-hidden
            style={{ x: ojoX, y: ojoY }}
            className="pointer-events-none absolute left-1/2 -top-14 md:-top-20 w-24 md:w-36 -ml-12 md:-ml-18"
          >
            <img src="/img/ojo.webp" alt="" className="w-full parpadeo boil" />
          </motion.div>
          <Deco
            src="/img/flecha-verde.webp"
            className="empuja boil w-12 md:w-44 -left-12 md:-left-44 top-1/2 -translate-y-1/3"
            style={{ "--dx": "12px" } as CSSProperties}
          />
          <Deco
            src="/img/flecha-roja.webp"
            className="empuja boil w-10 md:w-24 -right-3 md:-right-14 -top-12 md:-top-24 rotate-[35deg]"
            style={{ "--dx": "-6px", "--dy": "8px" } as CSSProperties}
          />
          <motion.a variants={pop} href="#sobre-mi" aria-label="Sobre Schützend" className="block">
            <span className="interactivo btn-amarillo font-serif! font-bold text-4xl md:text-8xl px-6 md:px-20 py-6 md:py-10 tracking-wide">
              {"SCHÜTZEND".split("").map((c, i) => (
                <motion.span key={i} custom={i} variants={letra} className="inline-block">
                  {c}
                </motion.span>
              ))}
            </span>
          </motion.a>
        </div>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } } }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-24 md:gap-y-10 max-w-4xl"
        >
          <Boton to="tienda" className="md:text-4xl! w-full px-8" />
          <Boton to="canales" className="md:text-4xl! w-full px-8" />
          <Boton to="contacto" className="md:text-4xl! w-full px-8" />
          <motion.div variants={stagger} className="col-span-2 md:col-span-3 flex flex-wrap justify-center gap-4 md:gap-24">
            <Boton to="productora" className="md:text-4xl! px-8" />
            <Boton to="colaboraciones" className="md:text-3xl! px-8" />
          </motion.div>
        </motion.div>
      </motion.div>
    </Vista>
  );
}

/* ───────────── 2. SOBRE MÍ ───────────── */
export function SobreMi() {
  return (
    <Vista style={{ background: "linear-gradient(180deg,#000 0%,#050302 40%,#1f0d04 70%,#5e2a0a 92%,#7a3510 100%)" }}>
      <Susurros frases={[{t:"no es lo que parece",x:"40%",y:"62%",r:-4}]} />
      <Nav
        left={["inicio"]}
        right={["colaboraciones"]}
        title="SCHÜTZEND"
        extra={<img src="/img/ola.webp" alt="" aria-hidden className="pointer-events-none hidden md:block w-44 -mt-2 mecer boil" />}
      />
      <motion.div variants={stagger} className="relative z-10 px-4 md:px-8 mt-5 md:mt-7 text-base md:text-[1.5rem] leading-snug">
        <motion.p variants={pop} className="boil-suave bg-white/10 border-l-4 border-[var(--color-verde)] max-w-5xl p-3 md:p-4">
          <Fosfo c="#2448d8" d={1}>Schützend (Alejandro)</Fosfo> es un artista joven de Toledo que expresa su
          intencionadamente excéntrico, no malintencionado, arte a través de todas las vías que le parecen adecuadas
          según qué tema.
        </motion.p>
        <motion.div variants={stagger} className="md:text-right mt-4 space-y-1 md:ml-auto max-w-5xl boil-suave">
          <motion.p variants={pop}>
            Tiene su productora audiovisual <Fosfo c="#e8333b" d={1.3}>Schützend Productions</Fosfo> (qué egocéntrico, lo
            escribo yo mismo), con la cual ha estado al menos tres veces en la pantalla grande, y más futuras,
            encabezándose por conseguir premios.
          </motion.p>
          <motion.p variants={pop}>
            También crea arte plástico de manera tradicional y digital, aparte de tener un pequeño proyecto musical del
            cual se puede encontrar un poco en SoundCloud.
          </motion.p>
          <motion.p variants={pop}>
            Pero además de escribir guiones para la pantalla, también es <Fosfo c="#0f9150" d={1.6}>escritor y poeta</Fosfo>:
            ha publicado dos libros, uno de ellos bajo editorial.
          </motion.p>
          <motion.p variants={pop}>Siempre interpreta su poesía en Slams en La Sagra.</motion.p>
          <motion.p variants={pop}>
            Y es artista en la Numanga y la Yuncomic; futuramente y esperadamente, en la Toledo Matsuri.
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mt-8 md:mt-0 md:absolute md:bottom-6 inset-x-0 flex flex-col md:flex-row items-center md:items-end justify-between gap-10 px-4 md:px-10 pb-10 md:pb-0">
        <motion.div variants={pop} className="flex flex-col items-center">
          <BichoAzul href={LINKS.portfolio} className="w-40 md:w-52 -mb-3 z-10 md:-ml-24" />
          <div className="relative flex items-center gap-2 md:gap-4">
            <Deco src="/img/flecha-negra.webp" className="static! w-14 md:w-20 -rotate-90 empuja boil" style={{ "--dx": "8px" } as CSSProperties} />
            <a
              href={LINKS.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="interactivo boil bg-[#3e5cb0] px-5 md:px-8 py-1 font-serif text-4xl md:text-6xl underline decoration-2 underline-offset-4 shadow-[5px_6px_0_#000]"
            >
              PORTFOLIO
            </a>
            <Deco src="/img/flecha-negra.webp" className="static! w-14 md:w-20 rotate-90 empuja boil" style={{ "--dx": "-8px" } as CSSProperties} />
          </div>
        </motion.div>

        <motion.div variants={stagger} className="relative grid grid-cols-3 items-center gap-x-4 gap-y-3 w-[min(92vw,30rem)]">
          <div className="flex justify-end"><Boton to="tienda" /></div>
          <motion.img
            src="/img/urraca.webp"
            alt=""
            aria-hidden
            className="pointer-events-none w-24 md:w-28 mx-auto row-span-2 boil"
            animate={{ y: [0, -8, 0], rotate: [0, -4, 0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex justify-start"><Boton to="canales" /></div>
          <div className="flex justify-end"><Boton to="productora" /></div>
          <div className="flex justify-start"><Boton to="contacto" /></div>
        </motion.div>
      </div>
    </Vista>
  );
}

/* ───────────── 3. TIENDA ───────────── */
function Producto({
  url,
  img,
  titulo,
  rot,
  retraso = 0,
}: {
  url: string | null;
  img: string;
  titulo: string;
  rot: number;
  retraso?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3 md:gap-5 flotar" style={{ animationDelay: `${retraso}s` }}>
      <Ext url={url} label={titulo} tilt rot={rot} className="cinta sombra-papel">
        <img src={img} alt={titulo} loading="lazy" className="w-40 md:w-56 h-auto block" />
      </Ext>
      <span className="boil font-serif font-semibold text-xl md:text-3xl text-center drop-shadow-[0_2px_6px_#000]">{titulo}</span>
    </div>
  );
}

export function Tienda() {
  return (
    <Vista style={{ background: "linear-gradient(180deg,#2b2847 0%,#16132b 40%,#07060f 100%)" }}>
      <Susurros frases={[{t:"todo tiene un precio",x:"40%",y:"88%",r:-3}]} />
      <Ondas />
      <Nav left={["contacto", "canales", "inicio"]} right={["colaboraciones", "productora"]} title="TIENDA" />
      <Deco src="/img/orquidea.webp" className="hidden md:block w-40 left-[15%] -bottom-2 mecer" />
      <Deco src="/img/orquidea.webp" className="hidden md:block w-40 right-[22%] -bottom-2 mecer" style={{ animationDelay: "-2s" }} />
      <motion.div
        variants={stagger}
        className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-around gap-12 md:gap-4 px-4 pt-10 md:pt-14 pb-16"
      >
        <Producto url={LINKS.umbrosfera} img="/img/umbrosfera.webp" titulo="UMBROSFERA" rot={-4} />
        <div className="relative mt-20 md:mt-40">
          <Bichito frase="¡Dame dinero!" className="w-20 md:w-28 left-1/2 -translate-x-1/2 -top-24 md:-top-32" />
          <Producto url={LINKS.comisiones} img="/img/comisiones.webp" titulo="COMISIONES / MECENAZGO" rot={2} retraso={-1.5} />
        </div>
        <Producto url={LINKS.magpies} img="/img/magpies.webp" titulo="MAGPIES & OLEANDERS" rot={4} retraso={-3} />
      </motion.div>
    </Vista>
  );
}

/* ───────────── 4. CANALES ───────────── */
function Canal({ url, img, imgClass, nombre, rot }: { url: string; img: string; imgClass: string; nombre: string; rot: number }) {
  return (
    <Ext url={url} label={`Canal de YouTube ${nombre}`} rot={rot} tilt className="entrada sombra-papel w-full md:w-[46rem]">
      <div className="flex items-center gap-3 md:gap-5 p-3 md:p-4 flex-1 min-w-0">
        <img src={img} alt="" className={`shrink-0 ${imgClass}`} />
        <span className="boil font-serif font-semibold text-lg md:text-5xl truncate">{nombre}</span>
      </div>
      <span className="talon flex text-base md:text-2xl"><span className="hidden md:inline">VER&nbsp;</span>▶</span>
    </Ext>
  );
}

export function Canales() {
  return (
    <Vista style={{ background: "linear-gradient(180deg,#3d0809 0%,#1a0405 45%,#000 100%)" }}>
      <Susurros frases={[{t:"te estamos viendo",x:"70%",y:"55%",r:6}]} />
      <Nav left={["contacto", "tienda"]} right={["inicio", "productora", "colaboraciones"]} title="CANALES" />
      <motion.div variants={stagger} className="relative z-10 flex flex-col gap-6 md:gap-9 px-4 md:px-14 pt-10 md:pt-12">
        <Canal url={LINKS.youtube.the} img="/img/av-the.webp" imgClass="w-14 md:w-24 border-4 border-white" nombre="@The_Schutzend" rot={-1.5} />
        <Canal url={LINKS.youtube.prod} img="/img/av-prod.webp" imgClass="w-14 md:w-24" nombre="@SchützendProductions" rot={1} />
        <Canal url={LINKS.youtube.music} img="/img/logo-music.webp" imgClass="w-16 md:w-44 mix-blend-lighten" nombre="@schützend_music" rot={-0.8} />
      </motion.div>
      <Bichito frase="¡Suscríbete a todos!" bocadilloPos="izquierda" className="w-16 md:w-24 right-4 md:right-14 bottom-4" />
    </Vista>
  );
}

/* ───────────── 5. CONTACTO ───────────── */
export function Contacto() {
  const rots = [-1.5, 1.2, -0.8, 1.5];
  return (
    <Vista className="bg-[linear-gradient(180deg,#141414,#000)]">
      <Susurros frases={[{t:"nadie escribe cartas ya",x:"64%",y:"78%",r:-5}]} />
      <Deco src="/img/garabatos.webp" className="inset-0 w-full h-full object-cover opacity-[0.07]" />
      <Nav left={["tienda", "canales"]} right={["inicio", "productora"]} title="CONTACTO" />
      <motion.div variants={stagger} className="relative z-10 grid md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-10 pt-8 md:pt-12 max-w-6xl">
        {LINKS.instagram.map((u, i) => (
          <Ext key={u} url={ig(u)} label={`Instagram ${u}`} rot={rots[i]} tilt className="entrada sombra-papel">
            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 min-w-0">
              <IconoInsta className="w-9 md:w-14 shrink-0" />
              <span className="boil font-serif font-semibold text-xl md:text-4xl truncate">{u}</span>
            </div>
          </Ext>
        ))}
        {LINKS.emails.map((m, i) => (
          <Ext key={m} url={`mailto:${m}`} label={`Email ${m}`} rot={i ? 1 : -1} tilt wrap="md:col-span-2" className="entrada sombra-papel md:w-fit">
            <div className="flex items-center gap-3 md:gap-5 p-3 md:p-4 min-w-0">
              <IconoMail className="w-9 md:w-14 shrink-0" />
              <span className="boil font-serif font-semibold text-base md:text-4xl break-all">{m}</span>
            </div>
            <span className="talon hidden md:flex text-2xl">ESCRIBIR ✉</span>
          </Ext>
        ))}
      </motion.div>
      <Bichito
        frase="¡Escríbenos también si te aburres!"
        bocadilloPos="izquierda"
        className="w-16 md:w-24 right-4 md:right-24 bottom-4"
      />
    </Vista>
  );
}

/* ───────────── 6. PRODUCTORA (3 pantallas con scroll) ───────────── */
function PieProductora() {
  return (
    <div className="pointer-events-none fixed bottom-0 inset-x-0 z-30 flex items-end justify-between gap-2 px-3 md:px-6 pb-2 md:pb-3 bg-gradient-to-t from-black/80 to-transparent">
      <a href={`mailto:${LINKS.emails[1]}`} className="interactivo pointer-events-auto flex items-center gap-2 md:gap-4">
        <IconoMail className="w-8 md:w-12" />
        <span className="hidden md:inline font-serif text-3xl">{LINKS.emails[1]}</span>
      </a>
      <div className="hidden md:flex items-center">
        <img src="/img/flecha-curva.webp" alt="" aria-hidden className="w-16 rotate-[20deg] empuja boil" style={{ "--dx": "6px" } as CSSProperties} />
        <img src="/img/logo-circular.webp" alt="Schützend Productions" className="w-20 boil" />
        <img src="/img/flecha-curva.webp" alt="" aria-hidden className="w-16 -scale-x-100 -rotate-[20deg] empuja boil" style={{ "--dx": "-6px" } as CSSProperties} />
      </div>
      <a
        href={ig("schutzend_productions")}
        target="_blank"
        rel="noopener noreferrer"
        className="interactivo pointer-events-auto flex items-center gap-2 md:gap-4"
      >
        <IconoInsta className="w-8 md:w-11" />
        <span className="hidden md:inline font-serif text-3xl">schutzend_productions</span>
      </a>
    </div>
  );
}

const fondoProd = "linear-gradient(180deg,#000 0%,#000 55%,#3a0d0d 100%)";
const pantalla = "relative min-h-dvh md:h-dvh w-full overflow-hidden pb-24";
const Luz = () => <div aria-hidden className="proyector pointer-events-none absolute inset-0" />;

function Poster({ url, img, titulo, pie, rot, className = "" }: { url: string | null; img: string; titulo: string; pie?: string; rot: number; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Ext url={url} label={titulo} rot={rot} tilt wrap="w-full" className="cinta border-[6px] border-[#eee] sombra-papel">
        <img src={img} alt={titulo} loading="lazy" className="w-full h-auto block" />
      </Ext>
      {pie && <span className="boil font-hand text-lg md:text-2xl text-center leading-tight whitespace-pre-line">{pie}</span>}
    </div>
  );
}

export function Productora() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      exit={{ opacity: 1, transition: { duration: 0.6 } }}
      variants={stagger}
      className="scroll-productora relative w-full"
      style={{ background: "#000" }}
    >
      {/* 6a */}
      <section className={pantalla} style={{ background: fondoProd }}>
        <Luz />
        <Susurros frases={[{ t: "corten.", x: "62%", y: "80%", r: -6 }]} />
        <Nav left={["tienda", "canales"]} right={["inicio", "contacto"]} />
        <motion.img
          variants={pop}
          src="/img/logo-prod.webp"
          alt="Schützend Productions"
          className="boil mx-auto w-56 md:absolute md:left-1/2 md:-translate-x-1/2 md:-top-2 md:w-[19rem] mix-blend-lighten"
        />
        <motion.div
          variants={stagger}
          className="relative z-10 grid grid-cols-2 md:grid-cols-[1fr_1fr_1.2fr_0.8fr] items-start gap-6 md:gap-8 px-4 md:px-8 mt-6 md:mt-8"
        >
          <Poster url="#proyecto/la-caverna" img="/img/caverna.webp" titulo="La Caverna" pie={"LARGO –\n2 PROYECCIONES EN CINE"} rot={-3} className="md:w-56" />
          <Poster url="#proyecto/el-maestro-del-cubo-yermo" img="/img/maestro.webp" titulo="El Maestro del Cubo Yermo" pie="CORTO – 1 PROYECCIÓN EN CINE" rot={2.5} className="md:w-48 md:mt-36" />
          <motion.div variants={pop} className="relative col-span-2 md:col-span-1 mt-16 md:mt-56 mx-auto">
            <Bichito frase="Shhh…" className="w-16 md:w-20 right-6 -top-20 md:-top-24" />
            <div className="cinta boil-suave bg-[#eee] text-black font-hand text-xl md:text-3xl text-center w-56 md:w-64 aspect-[3/4] flex flex-col items-center justify-center gap-6 px-4 sombra-papel rotate-[1.5deg]">
              <span>BODY SOUR<br />HOMESTEAD</span>
              <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
                PRÓXIMAMENTE…
              </motion.span>
            </div>
          </motion.div>
          <motion.div variants={stagger} className="col-span-2 md:col-span-1 flex flex-col items-center gap-5 md:mt-16">
            <motion.span variants={pop} className="boil font-hand text-xl md:text-2xl text-center">PEQUEÑOS<br />EXPERIMENTOS</motion.span>
            <Ext url="#proyecto/hades-epiphany" label="Hades Epiphany" rot={-2} tilt className="border-4 border-[#eee] w-40 md:w-44 sombra-papel">
              <img src="/img/hades.webp" alt="Hades Epiphany" loading="lazy" className="block w-full aspect-[2.4/1] object-cover" />
            </Ext>
            <Ext url="#proyecto/experimento" label="Experimento" rot={2} tilt className="border-4 border-[#eee] w-40 md:w-44 sombra-papel">
              <img src="/img/cara-blanca.webp" alt="Pequeño experimento" loading="lazy" className="block w-full aspect-[2/1] object-cover" />
            </Ext>
          </motion.div>
        </motion.div>
      </section>

      {/* 6b */}
      <motion.section className={pantalla} style={{ background: fondoProd }} {...enVista}>
        <Luz />
        <Nav left={["tienda", "canales"]} right={["inicio", "contacto"]} />
        <div className="relative z-10 grid md:grid-cols-[0.8fr_1.4fr_1fr] items-start gap-8 px-4 md:px-8 mt-8">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -60, rotate: -8 }, show: { opacity: 1, x: 0, rotate: -2, transition: { type: "spring", damping: 16 } } }}
            className="cinta bg-[#eee] p-3 md:p-4 w-60 md:w-full mx-auto sombra-papel"
          >
            <a href="#proyecto/flew-the-dreams" className="interactivo block" style={{ "--rot-hover": "0deg" } as CSSProperties}>
            <img src="/img/flew.webp" alt="Flew The Dreams" loading="lazy" className="w-full" />
            <p className="boil font-hand text-black text-center text-xl md:text-2xl mt-3 leading-tight">
              Flew The Dreams –<br />Proyecto a largo plazo
            </p>
            </a>
          </motion.div>
          <motion.p variants={pop} className="boil-suave font-serif font-bold text-lg md:text-[1.6rem] leading-snug md:text-justify">
            Estamos trabajando en el mayor proyecto de la productora. <Fosfo c="#e8333b" d={0.6}>Flew The Dreams</Fosfo> es un
            largometraje de más de dos horas de fantasía, misterio y acción, con un proceso que abarcará hasta 2030. Se
            proyectará de manera comercial en cines durante 7 días y se presentará a{" "}
            <Fosfo c="#a07206" d={1}>los Goya</Fosfo>. El trabajo está dividido por equipos, tenemos un servidor de Discord
            interno y trabajamos mucho.
          </motion.p>
          <motion.a
            variants={{ hidden: { opacity: 0, x: 60, rotate: 8 }, show: { opacity: 1, x: 0, rotate: 1.5, transition: { type: "spring", damping: 16 } } }}
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-64 md:w-full mx-auto"
          >
            <img
              src="/img/casting.webp"
              alt="Casting Schützend Productions: se necesitan camarógrafos, artistas, maquilladores y actores"
              loading="lazy"
              className="interactivo w-full sombra-papel"
            />
          </motion.a>
        </div>
      </motion.section>

      {/* 6c */}
      <motion.section className={pantalla} style={{ background: fondoProd }} {...enVista}>
        <Luz />
        <Nav left={["tienda", "canales"]} right={["inicio", "contacto"]} />
        <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14 px-4 md:px-10 mt-10 md:mt-16">
          <motion.p variants={pop} className="boil-suave font-serif font-semibold text-lg md:text-[1.45rem] leading-snug text-center max-w-6xl">
            <Fosfo c="#2448d8" d={0.5}>Buscamos nuevos integrantes</Fosfo> en Schützend Productions, principalmente actores
            adultos y camarógrafos, así como artistas o cualquier persona interesada en ayudar. Que nos escriba a
            cualquier contacto de la productora y hable de lo que podría aportar. No toda ayuda será aceptada. A tener
            en cuenta: la mayoría de producciones serán entre Toledo y Madrid, y ciertos proyectos requerirán la firma
            de contrato por cesión de derechos de imagen si es actor/actriz, o de compromiso si es otro tipo de ayuda.
            Repito: no siempre, solo en los proyectos grandes como Flew The Dreams.
          </motion.p>
          <Boton to="colaboraciones" big />
        </div>
      </motion.section>
      <PieProductora />
    </motion.main>
  );
}

/* ───────────── 7. COLABORACIONES ───────────── */
export function Colaboraciones() {
  return (
    <Vista style={{ background: "linear-gradient(180deg,#06103d 0%,#030720 35%,#000 60%)" }}>
      <Susurros frases={[{t:"¿te unes?",x:"78%",y:"70%",r:8}]} />
      <Nav left={["tienda", "canales"]} right={["inicio", "productora"]} title="COLABORACIONES" />
      <motion.div variants={stagger} className="relative z-10 px-4 md:px-8 font-serif font-semibold text-lg md:text-[2rem] leading-snug boil-suave">
        <motion.p variants={pop} className="text-center text-xl md:text-4xl mt-4">
          De momento las colaboraciones son <Fosfo c="#0f9150" d={1}>gratuitas</Fosfo>
        </motion.p>
        <motion.p variants={pop} className="mt-8 md:mt-10">
          Para colaboraciones de arte, contáctame en el Instagram de{" "}
          <a
            href={ig("schutzend_art")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-naranja)] underline-offset-4 hover:text-[var(--color-naranja)]"
          >
            schutzend_art
          </a>
          .
        </motion.p>
        <motion.p variants={pop} className="mt-6 max-w-5xl">
          Para colaboraciones en un cortometraje, ya sea porque tienes una idea propia o un guion que te gustaría
          grabar, <Fosfo c="#ff751f" d={1.4}>te lo producimos</Fosfo>: escríbenos a la cuenta de la productora o al Gmail.
        </motion.p>
      </motion.div>
      <motion.div variants={pop} className="relative z-10 flex items-center justify-center gap-4 md:gap-10 mt-14 md:mt-20 pb-28">
        <img src="/img/flecha-curva.webp" alt="" aria-hidden className="pointer-events-none w-16 md:w-36 empuja boil" style={{ "--dx": "14px" } as CSSProperties} />
        <Boton to="contacto" big />
        <img src="/img/flecha-curva.webp" alt="" aria-hidden className="pointer-events-none w-16 md:w-36 -scale-x-100 empuja boil" style={{ "--dx": "-14px" } as CSSProperties} />
      </motion.div>
      <Bichito frase="¡Que sí, que es gratis!" className="w-16 md:w-24 left-4 md:left-6 bottom-4" />
    </Vista>
  );
}

/* ───────────── PÁGINA DE PROYECTO (estilo cartelera) ───────────── */
export function ProyectoVista({ slug }: { slug: string }) {
  const i = Math.max(0, PROYECTOS.findIndex((p) => p.slug === slug));
  const p = PROYECTOS[i];
  const prev = PROYECTOS[(i - 1 + PROYECTOS.length) % PROYECTOS.length];
  const next = PROYECTOS[(i + 1) % PROYECTOS.length];
  const yt = p.youtube ? `https://www.youtube.com/watch?v=${p.youtube}` : LINKS.youtube.prod;

  return (
    <Vista className="bg-black" style={{ background: "radial-gradient(ellipse at 50% 30%,#1a0d0a 0%,#070404 60%,#000 100%)" }}>
      <Deco src="/img/garabatos.webp" className="inset-0 w-full h-full object-cover opacity-[0.09] boil-suave" />
      <Susurros frases={[{ t: "silencio, se rueda", x: "6%", y: "88%", r: -5 }]} />
      <a
        href="#productora"
        aria-label="Volver a la productora"
        className="interactivo absolute left-3 top-3 md:left-6 md:top-5 z-40 grid h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full bg-[var(--color-verde)] shadow-[4px_5px_0_#000]"
      >
        <span className="boil font-hand text-3xl text-black leading-none">←</span>
      </a>

      <motion.div variants={stagger} className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 md:pt-8 pb-16 md:h-dvh md:justify-center">
        <motion.div variants={pop} className="relative w-full max-w-4xl md:w-[min(100%,calc((100dvh-23rem)*16/9))]">
          <Deco src="/img/flecha-curva.webp" className="hidden md:block -left-36 bottom-10 w-32 empuja boil" style={{ "--dx": "12px" } as CSSProperties} />
          <Deco src="/img/flecha-curva.webp" className="hidden md:block -right-36 top-10 w-32 -scale-x-100 empuja boil" style={{ "--dx": "-12px" } as CSSProperties} />
          <div className="cinta relative aspect-video w-full overflow-hidden border-[6px] border-[#eee] bg-black sombra-papel rotate-[-0.6deg]">
            {p.youtube ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${p.youtube}`}
                title={p.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <a href={yt} target="_blank" rel="noopener noreferrer" className="group absolute inset-0 block">
                {p.poster ? (
                  <>
                    <img src={p.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover blur-xl scale-110 opacity-50" />
                    <img src={p.poster} alt={p.titulo} className="relative mx-auto h-full object-contain" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center font-hand text-4xl md:text-6xl text-white/70 boil">PRÓXIMAMENTE…</div>
                )}
                <span className="absolute left-1/2 top-1/2 grid h-20 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-[var(--color-rojo)] shadow-[4px_5px_0_#000] transition-transform group-hover:scale-110">
                  <span className="ml-1 border-y-[16px] border-l-[26px] border-y-transparent border-l-white" />
                </span>
              </a>
            )}
          </div>
        </motion.div>

        <motion.h1 variants={pop} className="mt-7 text-center font-serif font-bold text-4xl md:text-6xl">
          <span className="glitch inline-block"><span className="boil inline-block">{p.titulo}</span></span>
        </motion.h1>
        <motion.p variants={pop} className="boil mt-2 font-hand text-xl md:text-2xl text-[var(--color-amarillo)]">
          {p.tipo}
        </motion.p>
        {p.estado && (
          <motion.p variants={pop} className="mt-1 font-hand text-lg md:text-xl text-white/60" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            {p.estado}
          </motion.p>
        )}
        {p.texto && (
          <motion.p variants={pop} className="boil-suave mt-4 max-w-3xl text-center font-serif text-lg md:text-2xl leading-snug">
            {p.texto}
          </motion.p>
        )}

        <motion.div variants={stagger} className="mt-7 flex flex-wrap justify-center gap-4 md:gap-6">
          <Ext url={yt} label="Ver en YouTube" className="marco marco-rojo">
            {p.youtube ? "VER EN YOUTUBE" : "CANAL DE YOUTUBE"}
          </Ext>
          <Ext url={ig("schutzend_productions")} label="Instagram de la productora" className="marco marco-morado">
            INSTAGRAM
          </Ext>
          <Ext url="#colaboraciones" label="Colaborar" className="marco marco-rojo">
            ¿COLABORAS?
          </Ext>
        </motion.div>

        <motion.div variants={pop} className="mt-8 flex w-full max-w-4xl items-center justify-between gap-4 font-hand text-lg md:text-2xl">
          <a href={`#proyecto/${prev.slug}`} className="interactivo boil text-white/70 hover:text-white">← {prev.titulo}</a>
          <a href={`#proyecto/${next.slug}`} className="interactivo boil text-right text-white/70 hover:text-white">{next.titulo} →</a>
        </motion.div>
      </motion.div>
    </Vista>
  );
}
