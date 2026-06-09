import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function CertificatePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const admin = createAdminClient()
  const { data: certificate } = await admin
    .from('course_certificates')
    .select('*, product:products(name, category), profile:profiles(full_name)')
    .eq('product_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!certificate) redirect(`/learn/${id}`)

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/learn/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao curso
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-[#f97316]/25 bg-[#101510] p-10 text-center shadow-2xl md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(249,115,22,0.22),transparent_35%)]" />
        <div className="relative">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#f97316]/30 bg-[#f97316]/10 text-[#f97316]">
            <Award className="h-10 w-10" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f97316]">Certificado Flowyn</p>
          <h1 className="mt-6 text-4xl font-black text-white md:text-6xl">Conclusão de Curso</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/60">
            Certificamos que <strong className="text-white">{certificate.profile?.full_name || user.email}</strong> concluiu o curso
            <strong className="text-white"> {certificate.product?.name}</strong> na plataforma Flowyn.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-3xl border border-white/10 bg-black/20 p-6 text-left md:grid-cols-2">
            <Info label="Código" value={certificate.certificate_code} />
            <Info label="Emitido em" value={new Date(certificate.issued_at).toLocaleDateString('pt-BR')} />
            <Info label="Categoria" value={certificate.product?.category || 'Curso'} />
            <Info label="Plataforma" value="Flowyn Play" />
          </div>
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-white/35">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  )
}
