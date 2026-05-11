import { useEffect, useState, type FormEvent } from "react"
import type { Medicamento } from "../types/medicamento"
import { CATEGORIAS_PREDEFINIDAS } from "../types/medicamento"

type Props = {
  onAdd: (med: Omit<Medicamento, "id">) => Promise<string | null>
  onUpdate?: (
    id: string | number,
    med: Omit<Medicamento, "id">
  ) => Promise<string | null>
  editingMedicamento?: Medicamento | null
  onCancelEdit?: () => void
}

const OTRA = "__otra__"

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoriaSelect: "" as string,
  categoriaOtra: "",
}

export default function MedicamentoForm({
  onAdd,
  onUpdate,
  editingMedicamento,
  onCancelEdit,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  )
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!editingMedicamento) {
      setForm(emptyForm)
      return
    }
    const tipo = editingMedicamento.tipo?.trim() || ""
    const inList = (CATEGORIAS_PREDEFINIDAS as readonly string[]).includes(tipo)
    setForm({
      nombre: editingMedicamento.nombre,
      descripcion: editingMedicamento.descripcion || "",
      precio: String(editingMedicamento.precio),
      stock: String(editingMedicamento.stock),
      categoriaSelect: inList ? tipo : OTRA,
      categoriaOtra: inList ? "" : tipo,
    })
    setFeedback(null)
  }, [editingMedicamento])

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
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      tipo: categoriaFinal,
    }
    const err = editingMedicamento
      ? await onUpdate?.(editingMedicamento.id, payload)
      : await onAdd(payload)
    setSaving(false)

    if (err) {
      setFeedback({
        kind: "err",
        text: err,
      })
      return
    }

    if (editingMedicamento) {
      setFeedback({
        kind: "ok",
        text: "Cambios guardados correctamente.",
      })
      onCancelEdit?.()
    } else {
      setForm(emptyForm)
      setFeedback({
        kind: "ok",
        text: "Producto guardado correctamente.",
      })
    }
  }

  return (
    <section
      id="ph-inventario-panel"
      className="ph-panel"
      aria-labelledby="panel-inventario-title"
    >
      <h2 id="panel-inventario-title" className="ph-panel-title">
        {editingMedicamento ? "Editar producto" : "Alta de producto"}
      </h2>
      <p className="ph-panel-sub">
        {editingMedicamento
          ? "Modifica los datos y guarda para actualizar el catálogo."
          : "Registra medicamentos y artículos de salud. La categoría alimenta los filtros del catálogo."}
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
        <div className="ph-form-actions ph-form-actions-row">
          {editingMedicamento ? (
            <button
              type="button"
              className="ph-btn ph-btn-ghost"
              disabled={saving}
              onClick={() => {
                setFeedback(null)
                onCancelEdit?.()
              }}
            >
              Cancelar edición
            </button>
          ) : null}
          <button
            type="submit"
            className="ph-btn ph-btn-primary"
            disabled={saving}
          >
            {saving
              ? "Guardando…"
              : editingMedicamento
                ? "Guardar cambios"
                : "Guardar en catálogo"}
          </button>
        </div>
      </form>
    </section>
  )
}
