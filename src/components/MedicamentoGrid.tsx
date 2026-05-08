import type { Medicamento } from "../types/medicamento"

type Props = {
  medicamentos: Medicamento[]
  onDelete: (id: string | number) => void
  formatMoney: (n: number) => string
}

function stockLabel(stock: number): { text: string; className: string } {
  if (stock <= 0) return { text: "Agotado", className: "ph-stock ph-stock-out" }
  if (stock < 5) return { text: "Stock bajo", className: "ph-stock ph-stock-low" }
  return { text: "Disponible", className: "ph-stock ph-stock-ok" }
}

export default function MedicamentoGrid({
  medicamentos,
  onDelete,
  formatMoney,
}: Props) {
  if (medicamentos.length === 0) {
    return (
      <div className="ph-empty">
        <div className="ph-empty-icon" aria-hidden>
          💊
        </div>
        <h3 className="ph-empty-title">Sin resultados</h3>
        <p className="ph-empty-text">
          Prueba otra búsqueda o cambia la categoría. También puedes dar de alta
          nuevos productos en el panel de inventario.
        </p>
      </div>
    )
  }

  return (
    <ul className="ph-grid">
      {medicamentos.map((m) => {
        const s = stockLabel(m.stock)
        return (
          <li key={m.id} className="ph-card">
            <div className="ph-card-head">
              <span className="ph-card-badge">{m.tipo || "Sin categoría"}</span>
              <button
                type="button"
                className="ph-card-delete"
                onClick={() => onDelete(m.id)}
                title="Eliminar del catálogo"
              >
                Eliminar
              </button>
            </div>
            <h3 className="ph-card-title">{m.nombre}</h3>
            {m.descripcion ? (
              <p className="ph-card-desc">{m.descripcion}</p>
            ) : (
              <p className="ph-card-desc ph-card-desc-muted">
                Sin descripción registrada.
              </p>
            )}
            <div className="ph-card-footer">
              <span className="ph-card-price">{formatMoney(m.precio)}</span>
              <div className="ph-card-stock-row">
                <span className={s.className}>{s.text}</span>
                <span className="ph-card-units">
                  {m.stock} u.
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
