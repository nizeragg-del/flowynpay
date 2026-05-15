-- Adicionar colunas de JSONB para múltiplos arquivos
ALTER TABLE public.products
ADD COLUMN deliverable_file_paths JSONB DEFAULT '[]'::jsonb,
ADD COLUMN order_bump_file_paths JSONB DEFAULT '[]'::jsonb;

-- Copiar os dados existentes da coluna velha para a nova (opcional, para não perder os arquivos antigos)
UPDATE public.products
SET deliverable_file_paths = jsonb_build_array(deliverable_file_path)
WHERE deliverable_file_path IS NOT NULL AND deliverable_file_path != '';

-- Se quiser dropar a antiga coluna:
-- ALTER TABLE public.products DROP COLUMN deliverable_file_path;
