export const CIUDADES = [
  { nombre: "Pereira", valor: "Pereira", slug: "pereira" },
  { nombre: "Dosquebradas", valor: "Dosquebradas", slug: "dosquebradas" },
  { nombre: "Santa Rosa de Cabal", valor: "Sta Rosa", slug: "santa-rosa-de-cabal" },
];

export const SLUG_TODOS = "todos";
export const NOMBRE_TODOS = "Todos";

export function ciudadPorSlug(slug) {
  if (!slug) return null;

  if (slug === SLUG_TODOS) {
    return { nombre: NOMBRE_TODOS, valor: NOMBRE_TODOS, slug };
  }

  return CIUDADES.find((c) => c.slug === slug) || null;
}

export function slugDeCiudad(valor) {
  const encontrada = CIUDADES.find((c) => c.valor === valor);
  return encontrada ? encontrada.slug : SLUG_TODOS;
}

export function nombreDeCiudad(valor) {
  if (valor === NOMBRE_TODOS) return NOMBRE_TODOS;

  const encontrada = CIUDADES.find((c) => c.valor === valor);
  return encontrada ? encontrada.nombre : valor || "";
}
