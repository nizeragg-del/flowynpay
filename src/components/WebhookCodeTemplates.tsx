'use client'

import { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'

const TEMPLATES: Record<string, string> = {
  'nextjs-app': `import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-flowyn-signature');
    const secret = process.env.FLOWYN_WEBHOOK_SECRET; // wh_sec_...

    // 1. Verificação de Segurança (OBRIGATÓRIO)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyText)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);

    // 2. Proteção de Ambiente
    if (payload.is_sandbox && process.env.NODE_ENV === 'production') {
      console.log('Ignorando evento de teste em produção');
      return NextResponse.json({ received: true });
    }

    // 3. Processamento do Evento
    if (payload.event === 'purchase.created') {
      const { customer, plan_id, order_id } = payload;
      
      // Lógica do seu banco de dados
      // await db.users.create({ email: customer.email, plan: plan_id });
      console.log('✅ Cliente provisionado com sucesso!', customer.email);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook erro:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`,
  'express': `const express = require('express');
const crypto = require('crypto');
const app = express();

// IMPORTANTE: use express.raw() para ter o body original como buffer para validar a assinatura
app.use('/api/webhooks/flowyn', express.raw({ type: 'application/json' }));

app.post('/api/webhooks/flowyn', async (req, res) => {
  try {
    const signature = req.headers['x-flowyn-signature'];
    const secret = process.env.FLOWYN_WEBHOOK_SECRET;

    // 1. Verificação de Segurança (OBRIGATÓRIO)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).send('Assinatura inválida');
    }

    const payload = JSON.parse(req.body.toString());

    // 2. Proteção de Ambiente
    if (payload.is_sandbox && process.env.NODE_ENV === 'production') {
      console.log('Ignorando evento de teste em produção');
      return res.status(200).json({ received: true });
    }

    // 3. Processamento do Evento
    if (payload.event === 'purchase.created') {
      const { customer, plan_id, order_id } = payload;
      
      // Lógica de provisionamento de conta
      console.log(\`Provisionando \${customer.email} no plano \${plan_id}\`);
    }

    // SEMPRE retorne 200
    res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Webhook handler failed');
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));`,
  'laravel': `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

class FlowynWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $signature = $request->header('x-flowyn-signature');
        $secret = config('services.flowyn.webhook_secret');
        
        // 1. Verificação de Segurança (OBRIGATÓRIO)
        $expectedSignature = hash_hmac('sha256', $request->getContent(), $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json(['error' => 'Assinatura inválida'], 401);
        }

        $payload = $request->json()->all();

        // 2. Proteção de Ambiente
        if (isset($payload['is_sandbox']) && $payload['is_sandbox'] && app()->environment('production')) {
            Log::info('Ignorando evento de teste em produção');
            return response()->json(['received' => true], 200);
        }

        // 3. Processamento do Evento
        if (isset($payload['event']) && $payload['event'] === 'purchase.created') {
            $customer = $payload['customer'];
            $planId = $payload['plan_id'];
            
            Log::info("Cliente {$customer['email']} assinou o plano {$planId}");
        }

        return response()->json(['received' => true], 200);
    }
}
`,
  'fastapi': `from fastapi import FastAPI, Request, Header, HTTPException
from pydantic import BaseModel
from typing import Optional
import hmac
import hashlib
import os
import json

app = FastAPI()

# Definição do payload para type hinting (opcional na validação crua)
class Customer(BaseModel):
    name: str
    email: str

class FlowynPayload(BaseModel):
    event: str
    is_sandbox: bool
    order_id: Optional[str] = None
    plan_id: Optional[str] = None
    customer: Customer

@app.post("/api/webhooks/flowyn")
async def handle_flowyn_webhook(request: Request, x_flowyn_signature: str = Header(None)):
    body = await request.body()
    secret = os.getenv("FLOWYN_WEBHOOK_SECRET", "").encode('utf-8')

    # 1. Verificação de Segurança (OBRIGATÓRIO)
    expected_signature = hmac.new(secret, body, hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(expected_signature, x_flowyn_signature):
        raise HTTPException(status_code=401, detail="Assinatura inválida")

    payload_data = json.loads(body)
    
    # 2. Proteção de Ambiente
    if payload_data.get("is_sandbox") and os.getenv("ENVIRONMENT") == "production":
        print("Ignorando evento de teste em produção")
        return {"received": True}

    # 3. Processamento do Evento
    if payload_data.get("event") == "purchase.created":
        customer = payload_data.get("customer", {})
        print(f"Novo cliente: {customer.get('email')} - Plano: {payload_data.get('plan_id')}")
        
    return {"received": True}
`
  ,
  'make-com': `Fluxo Completo na Make.com:

PARTE 1: GATILHO (RECEBER DADOS)
1. Adicione o módulo "Webhooks > Custom Webhook"
2. Copie a URL gerada e cole no Painel da Flowyn
3. Dispare um teste para a Make receber a estrutura

PARTE 2: AÇÃO (CRIAR USUÁRIO NO SEU SUPABASE)
1. Adicione o módulo "HTTP > Make a request"
2. URL: https://[SEU_PROJETO].supabase.co/auth/v1/admin/users
3. Method: POST
4. Headers:
   - apikey: [SUA_SERVICE_ROLE_KEY]
   - Authorization: Bearer [SUA_SERVICE_ROLE_KEY]
5. JSON Body:
{
  "email": "{{1.customer.email}}",
  "password": "{{gerar_senha}}",
  "email_confirm": true,
  "user_metadata": {
    "full_name": "{{1.customer.name}}",
    "source": "flowyn"
  }
}`
}

export function WebhookCodeTemplates() {
  const [activeTab, setActiveTab] = useState('nextjs-app')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(TEMPLATES[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Como implementar no seu SaaS?</span>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          {[
            { id: 'nextjs-app', label: 'Next.js' },
            { id: 'express', label: 'Express.js' },
            { id: 'laravel', label: 'Laravel/PHP' },
            { id: 'fastapi', label: 'FastAPI/Python' },
            { id: 'make-com', label: 'Make.com (HTTP)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <button 
          onClick={handleCopy}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors border border-slate-700 shadow-lg"
          title="Copiar código"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
        <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto">
          <code>
            {TEMPLATES[activeTab]}
          </code>
        </pre>
      </div>
    </div>
  )
}
