import { CATEGORIA_TODAS } from "../types/medicamento"

type Props = {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: string[]
  filteredCount: number
  totalCount: number
}

export default function MedicamentoToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  filteredCount,
  totalCount,
}: Props) {
  return (
    <div className="ph-toolbar">
      <div className="ph-search-wrap">
        <label className="ph-visually-hidden" htmlFor="catalog-search">
          Buscar medicamento
        </label>
        <span className="ph-search-icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
              fill="currentColor"
              opacity=".35"
            />
            <path
              d="m16.5 16.5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          id="catalog-search"
          className="ph-search"
          type="search"
          placeholder="Buscar por nombre o descripción…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <p className="ph-results-meta">
        Mostrando{" "}
        <strong>
          {filteredCount} de {totalCount}
        </strong>{" "}
        productos
      </p>

      <div className="ph-chips" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={`ph-chip ${category === CATEGORIA_TODAS ? "ph-chip-active" : ""}`}
          onClick={() => onCategoryChange(CATEGORIA_TODAS)}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`ph-chip ${category === c ? "ph-chip-active" : ""}`}
            onClick={() => onCategoryChange(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
