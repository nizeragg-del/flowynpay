'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DollarSign, Users, CreditCard, Activity, TrendingUp, TrendingDown, ArrowRight, MousePointerClick, Percent } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRevenue: 0, totalCommissions: 0, paidCount: 0, pendingCount: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const isProducer = prof?.role === 'producer'

      let orders: any[] = []

      if (isProducer) {
        const { data: myProducts } = await supabase.from('products').select('id').eq('owner_id', user.id)
        const productIds = myProducts?.map(p => p.id) || []
        if (productIds.length > 0) {
          const { data } = await supabase
            .from('orders')
            .select('*, product:products(name), affiliate:profiles(full_name)')
            .in('product_id', productIds)
            .order('created_at', { ascending: false })
          orders = data || []
        }
      } else {
        const { data } = await supabase
          .from('orders')
          .select('*, product:products(name)')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false })
        orders = data || []
      }

      const paid = orders.filter(o => o.status === 'paid')
      const totalRevenue = paid.reduce((acc, o) => acc + Number(o.amount), 0)
      const totalCommissions = paid.reduce((acc, o) => acc + Number(o.commission_amount), 0)

      setStats({
        totalRevenue,
        totalCommissions,
        paidCount: paid.length,
        pendingCount: orders.filter(o => o.status === 'pending').length
      })

      setRecentOrders(orders.slice(0, 5))

      // Build chart data from last 7 days
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      const chart: any[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
        const dayOrders = paid.filter(o => {
          const created = new Date(o.created_at)
          return created >= dayStart && created < dayEnd
        })
        chart.push({
          name: days[dayStart.getDay()],
          revenue: dayOrders.reduce((acc: number, o: any) => acc + Number(o.amount), 0),
          commission: dayOrders.reduce((acc: number, o: any) => acc + Number(o.commission_amount), 0),
        })
      }
      setChartData(chart)

      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando painel de controle...</div>
  }

  const isProducer = profile?.role === 'producer'
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  return (
    <div className="w-full pb-12">
      <main className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Visão do {isProducer ? 'Produtor' : 'Afiliado'}
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              {isProducer ? 'Acompanhe seu faturamento global e assinaturas.' : 'Acompanhe seus cliques, conversões e comissões.'}
            </p>
          </div>
          
          {isProducer ? (
            <Link href="/dashboard/products/new" className="bg-primary hover:bg-sidebar text-white px-6 py-2.5 rounded-lg font-semibold shadow-md shadow-primary/20 transition-all flex items-center gap-2">
              Criar Novo Produto
            </Link>
          ) : (
            <Link href="/market" className="bg-primary hover:bg-sidebar text-white px-6 py-2.5 rounded-lg font-semibold shadow-md shadow-primary/20 transition-all flex items-center gap-2">
              Encontrar Produtos
            </Link>
          )}
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isProducer ? 'Faturamento Total' : 'Comissões Ganhas'}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {fmt(isProducer ? stats.totalRevenue : stats.totalCommissions)}
                </h3>
              </div>
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-slate-500">Vendas aprovadas</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isProducer ? 'Comissões Geradas' : 'Volume Gerado'}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {fmt(isProducer ? stats.totalCommissions : stats.totalRevenue)}
                </h3>
              </div>
              <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-slate-500">{isProducer ? 'Aos afiliados' : 'Valor bruto das vendas'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendas Aprovadas</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.paidCount}</h3>
              </div>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-slate-500">Transações com status pago</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Pendentes</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.pendingCount}</h3>
              </div>
              <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-slate-500">Aguardando confirmação</span>
            </div>
          </div>
        </div>

        {/* Charts and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Desempenho Geral</h3>
                <p className="text-sm text-slate-500">Faturamento vs Comissões — últimos 7 dias</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6a1b9a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6a1b9a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `R$${val}`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="revenue" name="Faturamento (R$)" stroke="#6a1b9a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="commission" name="Comissões (R$)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Sem dados suficientes para o gráfico
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Vendas Recentes</h3>
              <Link href="/dashboard/sales" className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-primary">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <DollarSign className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">Nenhuma venda registrada ainda.</p>
                <p className="text-slate-400 text-xs mt-1">As transações aparecerão aqui em tempo real.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                        {order.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">{order.customer_name}</h4>
                        <p className="text-xs text-slate-500">{order.product?.name || '—'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">{fmt(Number(order.amount))}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${order.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {order.status === 'paid' ? 'Aprovado' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href="/dashboard/sales" className="w-full mt-4 py-3 text-sm font-semibold text-primary hover:bg-slate-50 rounded-xl transition-colors text-center block">
              Ver Relatório Completo
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
