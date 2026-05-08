-- Ejecutar en Supabase: SQL Editor → New query → Run
-- Si al guardar productos ves "new row violates row-level security policy",
-- es porque RLS está activo sin políticas que permitan INSERT.

alter table public.medicamentos enable row level security;

drop policy if exists "medicamentos_select_all" on public.medicamentos;
drop policy if exists "medicamentos_insert_all" on public.medicamentos;
drop policy if exists "medicamentos_update_all" on public.medicamentos;
drop policy if exists "medicamentos_delete_all" on public.medicamentos;

-- Desarrollo / demo: rol anon (clave publishable del front) puede leer y escribir.
-- En producción sustituye por políticas con auth.uid() o roles específicos.
create policy "medicamentos_select_all"
  on public.medicamentos
  for select
  to anon, authenticated
  using (true);

create policy "medicamentos_insert_all"
  on public.medicamentos
  for insert
  to anon, authenticated
  with check (true);

create policy "medicamentos_update_all"
  on public.medicamentos
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "medicamentos_delete_all"
  on public.medicamentos
  for delete
  to anon, authenticated
  using (true);
