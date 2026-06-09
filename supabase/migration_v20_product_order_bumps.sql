CREATE TABLE IF NOT EXISTS product_order_bumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2) DEFAULT 0,
  file_paths JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_order_bumps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Producers can manage own order bumps"
  ON product_order_bumps FOR ALL TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE owner_id = auth.uid()))
  WITH CHECK (product_id IN (SELECT id FROM products WHERE owner_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_pob_product_id ON product_order_bumps(product_id);
CREATE INDEX IF NOT EXISTS idx_pob_sort_order ON product_order_bumps(sort_order);

GRANT SELECT, INSERT, UPDATE, DELETE ON product_order_bumps TO authenticated;
