import { useEffect, useState } from "react"
import { supabase } from "../utils/supabase"
import type { Medicamento } from "../types/medicamento"

export default function useData() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])

  const fetchMedicamentos = async () => {
    const { data } = await supabase.from("medicamentos").select("*")
    setMedicamentos((data as Medicamento[]) || [])
  }

  useEffect(() => {
    void fetchMedicamentos()
  }, [])

  const addMedicamento = async (med: Omit<Medicamento, "id">) => {
    await supabase.from("medicamentos").insert([med])
    await fetchMedicamentos()
  }

  const deleteMedicamento = async (id: string | number) => {
    await supabase.from("medicamentos").delete().eq("id", id)
    await fetchMedicamentos()
  }

  return {
    medicamentos,
    addMedicamento,
    deleteMedicamento,
    fetchMedicamentos,
  }
}
