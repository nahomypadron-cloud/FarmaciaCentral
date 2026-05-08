import { useState, type FormEvent } from "react"
import type { Medicamento } from "../types/medicamento"
import { CATEGORIAS_PREDEFINIDAS } from "../types/medicamento"

type Props = {
  onAdd: (med: Omit<Medicamento, "id">) => Promise<string | null>
}

const OTRA = "__otra__"

export default function MedicamentoForm({ onAdd }: Props) {
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  )
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaSelect: "" as string,
    categoriaOtra: "",
  })

  const categoriaFinal =
    form.categoriaSelect === OTRA
      ? form.categoriaOtra.trim()
      : form.categoriaSelect.trim()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio || !form.stock || !categoriaFinal) {
      return
    }

    setSaving(true)
    setFeedback(null)
    const err = await onAdd({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      tipo: categoriaFinal,
    })
    setSaving(false)

    if (err) {
      setFeedback({
        kind: "err",
        text: err,
      })
      return
    }

    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaSelect: "",
      categoriaOtra: "",
    })
    setFeedback({
      kind: "ok",
      text: "Producto guardado correctamente.",
    })
  }

  return (
    <section className="ph-panel" aria-labelledby="panel-inventario-title">
      <h2 id="panel-inventario-title" className="ph-panel-title">
        Alta de producto
      </h2>
      <p className="ph-panel-sub">
        Registra medicamentos y artículos de salud. La categoría alimenta los
        filtros del catálogo.
      </p>
      <form className="ph-form" onSubmit={handleSubmit}>
        <div className="ph-form-grid">
          <div className="ph-field ph-field-span2">
            <label htmlFor="med-nombre">Nombre comercial</label>
            <input
              id="med-nombre"
              required
              placeholder="Ej. Ibuprofeno 400 mg"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="ph-field">
            <label htmlFor="med-cat">Categoría</label>
            <select
              id="med-cat"
              required
              value={form.categoriaSelect}
              onChange={(e) =>
                setForm({ ...form, categoriaSelect: e.target.value })
              }
            >
              <option value="">Seleccione…</option>
              {CATEGORIAS_PREDEFINIDAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OTRA}>Otra categoría…</option>
            </select>
          </div>
          {form.categoriaSelect === OTRA ? (
            <div className="ph-field">
              <label htmlFor="med-cat-otra">Nombre de la categoría</label>
              <input
                id="med-cat-otra"
                required
                placeholder="Escribe la categoría"
                value={form.categoriaOtra}
                onChange={(e) =>
                  setForm({ ...form, categoriaOtra: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="ph-field ph-field-placeholder" aria-hidden />
          )}
          <div className="ph-field ph-field-span2">
            <label htmlFor="med-desc">Descripción (opcional)</label>
            <textarea
              id="med-desc"
              rows={2}
              placeholder="Presentación, laboratorio, indicación breve…"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>
          <div className="ph-field">
            <label htmlFor="med-precio">Precio unitario</label>
            <input
              id="med-precio"
              type="number"
              min={0}
              step="0.01"
              required
              placeholder="0.00"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
          </div>
          <div className="ph-field">
            <label htmlFor="med-stock">Unidades en stock</label>
            <input
              id="med-stock"
              type="number"
              min={0}
              step={1}
              required
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>
        {feedback ? (
          <p
            className={
              feedback.kind === "ok" ? "ph-form-feedback ph-form-ok" : "ph-form-feedback ph-form-err"
            }
            role={feedback.kind === "err" ? "alert" : "status"}
          >
            {feedback.kind === "err" && (
              <>
                <strong>No se pudo guardar.</strong> {feedback.text}{" "}
                Si el mensaje habla de «row-level security» o «RLS», abre el archivo{" "}
                <code className="ph-code">supabase/medicamentos_rls.sql</code> en el
                proyecto y ejecútalo en el SQL Editor de Supabase.
              </>
            )}
            {feedback.kind === "ok" ? feedback.text : null}
          </p>
        ) : null}
        <div className="ph-form-actions">
          <button
            type="submit"
            className="ph-btn ph-btn-primary"
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar en catálogo"}
          </button>
        </div>
      </form>
    </section>
  )
}
