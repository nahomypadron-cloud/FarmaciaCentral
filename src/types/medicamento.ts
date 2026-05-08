export type Medicamento = {
  id: string | number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  tipo: string
}

export const CATEGORIAS_PREDEFINIDAS = [
  "Analgésicos y antiinflamatorios",
  "Antibióticos",
  "Antialérgicos",
  "Sistema digestivo",
  "Cardiovascular",
  "Dermatológicos",
  "Vitaminas y suplementos",
  "Cuidado personal e higiene",
  "Diabetes y metabolismo",
  "Salud respiratoria",
] as const

export const CATEGORIA_TODAS = "todas" as const
