-- ============================================================
-- Flowyn Platform Relaunch — Migration v2
-- Transforma a Flowyn em plataforma completa de afiliados
-- ============================================================

-- ============================================================
-- 1. PRODUCTS: Novos campos
-- ============================================================
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'outros',
  ADD COLUMN IF NOT EXISTS is_flowyn_saas BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS checkout_banner_url TEXT,
  ADD COLUMN IF NOT EXISTS checkout_video_url TEXT,
  ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'external',
  ADD COLUMN IF NOT EXISTS delivery_url TEXT,
  ADD COLUMN IF NOT EXISTS order_bump_title TEXT,
  ADD COLUMN IF NOT EXISTS order_bump_description TEXT,
  ADD COLUMN IF NOT EXISTS order_bump_price NUMERIC,
  ADD COLUMN IF NOT EXISTS order_bump_discount_percent NUMERIC;

-- cover_url e category podem já existir, apenas garantir
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT;

-- ============================================================
-- 2. PLANS: Tipo de cobrança
-- ============================================================
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS billing_type TEXT NOT NULL DEFAULT 'one_time',
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- ============================================================
-- 3. RLS PRODUCTS: Qualquer usuário autenticado pode criar
-- ============================================================
DROP POLICY IF EXISTS "Producers can insert their own products." ON public.products;

CREATE POLICY "Any authenticated user can insert their own products."
ON public.products FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- ============================================================
-- 4. RLS AFFILIATIONS: Qualquer usuário pode se afiliar
-- ============================================================
DROP POLICY IF EXISTS "Affiliates can insert their own affiliations" ON public.affiliations;

CREATE POLICY "Any authenticated user can create their own affiliations"
ON public.affiliations FOR INSERT WITH CHECK (auth.uid() = affiliate_id);

-- ============================================================
-- 5. FLOWYN SaaS PRODUCTS: Tabela para MicroSaaS da Flowyn
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flowyn_saas_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  commission_rate NUMERIC NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.flowyn_saas_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Flowyn SaaS products viewable by everyone"
ON public.flowyn_saas_products FOR SELECT USING (true);

CREATE POLICY "Only service role can manage Flowyn SaaS"
ON public.flowyn_saas_products FOR ALL USING (false)
WITH CHECK (false);

-- ============================================================
-- 6. COURSE MODULES: Módulos dos cursos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course modules viewable by everyone"
ON public.course_modules FOR SELECT USING (true);

CREATE POLICY "Product owners can manage modules"
ON public.course_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.owner_id = auth.uid())
);

-- ============================================================
-- 7. COURSE LESSONS: Aulas dos cursos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Free preview lessons viewable by everyone"
ON public.course_lessons FOR SELECT USING (is_free_preview = true);

CREATE POLICY "Product owners can manage lessons"
ON public.course_lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.owner_id = auth.uid())
);

-- ============================================================
-- 8. STUDENT ACCESS: Controle de acesso ao conteúdo
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.student_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access"
ON public.student_access FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Product owners can view access list"
ON public.student_access FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.owner_id = auth.uid())
);

CREATE POLICY "System can manage student access"
ON public.student_access FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 9. ORDERS: Adicionar campo para order bump
-- ============================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS includes_order_bump BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS order_bump_amount NUMERIC DEFAULT 0;
