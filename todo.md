# Anjos Urbanos Virtual — SaaS Platform TODO

## Backend
- [x] Schema da base de dados (users, salons, subscriptions)
- [x] DB helpers (queries para saloes e subscricoes)
- [x] Router tRPC: auth, salon, subscription, admin
- [x] Middleware adminProcedure para controlo de acesso
- [x] Integracao Stripe: checkout, portal de faturacao
- [x] Webhook Stripe: checkout.session.completed, subscription.updated, subscription.deleted, invoice.payment_failed
- [x] Migracao da base de dados (pnpm db:push)

## Frontend
- [x] Landing page com hero, features, precos e testemunhos
- [x] Pagina de subscricao com checkout Stripe
- [x] Dashboard do salao com acesso ao assistente IA
- [x] Painel de administracao com estatisticas e lista de clientes
- [x] Routing: /, /dashboard, /subscribe, /admin
- [x] Tema elegante rose gold para salao de beleza
- [x] Fontes Playfair Display + Inter

## Testes
- [x] Testes auth.logout (existentes)
- [x] Testes subscription.hasAccess (admin bypass, active, inactive)
- [x] Testes subscription.get
- [x] Testes admin.getStats (FORBIDDEN para nao-admin)
- [x] Testes auth.me

## Pendente / Proximos passos
- [ ] Reclamar sandbox Stripe
- [ ] Testar fluxo completo de pagamento com cartao 4242 4242 4242 4242
- [ ] Configurar dominio personalizado no painel Manus
- [x] Publicar (botao Publish no painel Manus)
- [ ] Criar conta de salao de demonstracao para formacoes
- [x] Redesign com cores da marca anjosurbanos.pt (dark + verde neon)
- [x] Corrigir salon.get para retornar null em vez de undefined
- [x] Redirecionar para /dashboard apos login OAuth
- [x] Ligar dominio personalizado (anjosurbanosvirtual.com)
- [x] Sistema de 2 simulações gratuitas por utilizador com modal de upgrade
- [x] Contador "2 simulações gratuitas sem cartão" na landing page
- [x] Notificação ao owner após 2ª simulação gratuita (follow-up de conversão)
- [x] Período de teste gratuito de 7 dias no checkout Stripe
