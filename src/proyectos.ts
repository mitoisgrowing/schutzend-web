// Proyectos de la productora. Cada uno tiene su página propia (#proyecto/<slug>).
// youtube: ID del vídeo (lo que va después de watch?v=). Si es null, se muestra el póster
// y el botón lleva al canal de la productora.
export type Proyecto = {
  slug: string;
  titulo: string;
  tipo: string;
  poster: string;
  youtube: string | null;
  texto?: string;
  estado?: string;
};

export const PROYECTOS: Proyecto[] = [
  {
    slug: "la-caverna",
    titulo: "La Caverna",
    tipo: "Largometraje · 2 proyecciones en cine",
    poster: "/img/caverna.webp",
    youtube: null,
  },
  {
    slug: "el-maestro-del-cubo-yermo",
    titulo: "El Maestro del Cubo Yermo",
    tipo: "Cortometraje · 1 proyección en cine",
    poster: "/img/maestro.webp",
    youtube: null,
  },
  {
    slug: "flew-the-dreams",
    titulo: "Flew The Dreams",
    tipo: "Largometraje · Proyecto a largo plazo",
    poster: "/img/flew.webp",
    youtube: null,
    estado: "En producción · hasta 2030",
    texto:
      "El mayor proyecto de la productora: un largometraje de más de dos horas de fantasía, misterio y acción. Se proyectará de manera comercial en cines durante 7 días y se presentará a los Goya.",
  },
  {
    slug: "body-sour-homestead",
    titulo: "Body Sour Homestead",
    tipo: "Próximamente",
    poster: "",
    youtube: null,
    estado: "Próximamente…",
  },
  {
    slug: "hades-epiphany",
    titulo: "Hades Epiphany",
    tipo: "Pequeño experimento",
    poster: "/img/hades.webp",
    youtube: null,
  },
  {
    slug: "experimento",
    titulo: "Pequeño experimento",
    tipo: "Pequeño experimento",
    poster: "/img/cara-blanca.webp",
    youtube: null,
  },
];
