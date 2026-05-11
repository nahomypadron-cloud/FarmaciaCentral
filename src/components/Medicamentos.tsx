import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "../utils/supabase"
import type { Medicamento } from "../types/medicamento"
import { CATEGORIA_TODAS } from "../types/medicamento"
import MedicamentoForm from "./MedicamentoForm"
import MedicamentoGrid from "./MedicamentoGrid"
import MedicamentoToolbar from "./MedicamentoToolbar"

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
})

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>(CATEGORIA_TODAS)
  const [editingId, setEditingId] = useState<string | number | null>(null)

  const fetchMedicamentos = useCallback(async () => {
    setListError(null)
    setLoading(true)
    const { data, error: err } = await supabase
      .from("medicamentos")
      .select("*")
      .order("nombre", { ascending: true })

    if (err) {
      setListError(err.message)
      setMedicamentos([])
    } else {
      setMedicamentos((data as Medicamento[]) || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchMedicamentos()
  }, [fetchMedicamentos])

  useEffect(() => {
    if (editingId == null) return
    if (!medicamentos.some((m) => m.id === editingId)) {
      setEditingId(null)
    }
  }, [medicamentos, editingId])

  const editingMedicamento = useMemo(() => {
    if (editingId == null) return null
    return medicamentos.find((m) => m.id === editingId) ?? null
  }, [medicamentos, editingId])

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const m of medicamentos) {
      const t = m.tipo?.trim()
      if (t) set.add(t)
    }
    return [...set].sort((a, b) => a.localeCompare(b, "es"))
  }, [medicamentos])

  const filtered = useMemo(() => {
    const q = normalize(search.trim())
    return medicamentos.filter((m) => {
      if (category !== CATEGORIA_TODAS && m.tipo !== category) return false
      if (!q) return true
      const hay = `${m.nombre} ${m.descripcion || ""} ${m.tipo || ""}`
      return normalize(hay).includes(q)
    })
  }, [medicamentos, search, category])

  const stats = useMemo(() => {
    const valor = medicamentos.reduce((a, m) => a + m.precio * m.stock, 0)
    const bajos = medicamentos.filter((m) => m.stock > 0 && m.stock < 5).length
    const agotados = medicamentos.filter((m) => m.stock <= 0).length
    return { valor, bajos, agotados }
  }, [medicamentos])

  const addMedicamento = async (
    med: Omit<Medicamento, "id">
  ): Promise<string | null> => {
    const { error: err } = await supabase.from("medicamentos").insert([med])
    if (err) {
      return err.message
    }
    await fetchMedicamentos()
    return null
  }

  const deleteMedicamento = async (id: string | number) => {
    const ok = window.confirm("¿Eliminar este producto del catálogo?")
    if (!ok) return
    const { error: err } = await supabase.from("medicamentos").delete().eq("id", id)
    if (err) {
      setListError(err.message)
      return
    }
    if (editingId === id) setEditingId(null)
    await fetchMedicamentos()
  }

  const updateMedicamento = async (
    id: string | number,
    med: Omit<Medicamento, "id">
  ): Promise<string | null> => {
    const { error: err } = await supabase.from("medicamentos").update(med).eq("id", id)
    if (err) {
      return err.message
    }
    await fetchMedicamentos()
    return null
  }

  const handleEdit = useCallback((id: string | number) => {
    setEditingId(id)
    requestAnimationFrame(() => {
      document
        .getElementById("ph-inventario-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  return (
    <div className="ph-app">
      <header className="ph-header">
        <div className="ph-header-inner">
          <div className="ph-brand">
            <span className="ph-brand-mark" aria-hidden>
              +
            </span>
            <div>
              <p className="ph-brand-name">Farmacia Central</p>
              <p className="ph-brand-tag">Catálogo e inventario</p>
            </div>
          </div>
          <div className="ph-header-pill">
            <span className="ph-dot" aria-hidden />
            Sistema en línea
          </div>
        </div>
      </header>

      <main className="ph-main">
        {listError ? (
          <div className="ph-alert" role="alert">
            <strong>Error al cargar el catálogo.</strong> {listError}{" "}
            Si acabas de crear el proyecto, revisa{" "}
            <code className="ph-code">VITE_SUPABASE_URL</code> y{" "}
            <code className="ph-code">VITE_SUPABASE_PUBLISHABLE_KEY</code> en{" "}
            <code className="ph-code">.env</code> y reinicia{" "}
            <code className="ph-code">npm run dev</code>.
          </div>
        ) : null}

        <section className="ph-hero" aria-labelledby="hero-title">
          <div className="ph-hero-overlay">
            <h1 id="hero-title" className="ph-hero-title">
              Encuentra medicamentos y productos de salud
            </h1>
            <p className="ph-hero-lead">
              Busca por nombre o filtra por categoría. Inventario pensado para
              operación diaria de farmacia.
            </p>
          </div>
          <div className="ph-stats">
            <div className="ph-stat">
              <span className="ph-stat-label">Referencias</span>
              <span className="ph-stat-value">{medicamentos.length}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">Valor inventario</span>
              <span className="ph-stat-value">{money.format(stats.valor)}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">Stock bajo (&lt;5)</span>
              <span className="ph-stat-value">{stats.bajos}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">Agotados</span>
              <span className="ph-stat-value">{stats.agotados}</span>
            </div>
          </div>
        </section>

        <MedicamentoToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          filteredCount={filtered.length}
          totalCount={medicamentos.length}
        />

        {loading ? (
          <div className="ph-loading" aria-busy="true">
            <div className="ph-spinner" />
            <p>Cargando catálogo…</p>
          </div>
        ) : (
          <MedicamentoGrid
            medicamentos={filtered}
            onDelete={deleteMedicamento}
            onEdit={handleEdit}
            formatMoney={(n) => money.format(n)}
          />
        )}

        <MedicamentoForm
          onAdd={addMedicamento}
          onUpdate={updateMedicamento}
          editingMedicamento={editingMedicamento}
          onCancelEdit={cancelEdit}
        />
      </main>

      <footer className="ph-footer">
        <p>
          Uso interno — verifique siempre la receta y las interacciones antes
          de dispensar.
        </p>
      </footer>
    </div>
  )
}
