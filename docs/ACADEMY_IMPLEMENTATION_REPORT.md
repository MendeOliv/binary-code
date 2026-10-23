# Relatório final — Código Binário Academy

## A. Veredicto

**PASS WITH LIMITATIONS**.

A implementação compila, passa typecheck/lint/build, tem cobertura de validação Academy, responde localmente, disponibiliza os PDFs íntegros e teve validação visual desktop no browser sandbox. Não pode ser declarada `PASS` porque a migração/persistência Supabase não foi validada, a suite completa da API continua parcialmente bloqueada por configuração Supabase ausente no processo de testes e a validação visual tablet/mobile não foi concluída.

Não foi feito push nem deployment, em conformidade com a regra de não publicar enquanto uma validação essencial permanecer pendente.

## B. Auditoria Git

- Repositório: `MendeOliv/binary-code`.
- Branch inicial/final: `feat/academy`.
- Commit-base: `1fcc28ad7c2a3aeb56cf342f815607196bcdb3e7` (`master` e `origin/master`).
- Commit Academy existente: `256c082 feat: add Código Binário Academy`.
- Estado inicial desta auditoria: working tree limpo, branch local dois commits à frente de `master`; `origin/feat/academy` não existia.
- Alteração encontrada durante esta auditoria: corrida concorrente na idempotência Academy.
- Alterações preexistentes não relacionadas: nenhuma; o trabalho anterior foi preservado.
- Estado final desta auditoria: duas alterações locais ainda não commitadas (`repository.ts` e `academy-requests.ts`) e o teste/relatório actualizado nesta fase precisam de ser consolidados depois de desbloqueada a validação Supabase.

## C. Código auditado e correções

Foram auditados os ficheiros Academy, a tabela `leads`, o repositório Supabase, validação Zod, notificações, navegação, sitemap, configuração de deployment e testes existentes.

Correção comprovada efectuada:

- A rota Academy fazia `SELECT` seguido de `INSERT`. Duas submissões simultâneas com o mesmo `request_id` podiam colidir no índice único e devolver `500`.
- Foi adicionado `createAcademyLead()` no repositório, usando `upsert(..., { onConflict: 'request_id', ignoreDuplicates: true })` e leitura do vencedor quando há retry concorrente.
- O lead vencedor não é sobrescrito; retries não criam nova actividade CRM nem novas notificações.
- Foram adicionados testes de validação para pedido válido, email inválido, mensagem excedida, consentimento ausente, campo inesperado e NUL byte.

Alterações deliberadamente evitadas:

- Nenhuma alteração destrutiva ou de dados existentes.
- Nenhum segundo CRM, LMS, pagamentos, contas de alunos, tracker ou fornecedor novo.
- Nenhuma alteração a DNS, Render, Vercel, `master` ou deployment.
- Nenhum teste removido ou enfraquecido.

## D. Supabase

### Ambiente

As credenciais fornecidas correspondem a um projeto Supabase cujo nome/uso não permite classificar com segurança como desenvolvimento, staging ou produção. A classificação operacional fica **INDETERMINADA**.

Além disso, nesta execução as credenciais não ficaram disponíveis como variáveis efémeras utilizáveis no terminal. Não foram copiadas para ficheiro, comando, Git, log ou documentação.

### Migração

`apps/api/migrations/009_academy_requests.sql` foi auditada. É aditiva e compatível com a tabela `leads` existente:

- `source TEXT NOT NULL DEFAULT 'diagnostic'` preserva leads antigos.
- `academy_course_id TEXT` é opcional.
- `request_id UUID` é opcional para compatibilidade retroactiva.
- Índice único parcial em `request_id` aplica idempotência apenas a pedidos que fornecem identificador.
- Índices de origem e curso suportam consultas CRM.
- Nenhuma coluna ou linha existente é removida ou alterada.

A migração **não foi aplicada** porque o ambiente não pôde ser identificado com segurança e não existe autorização específica para alterar um possível ambiente de produção.

### Verificações

- Não houve operação de escrita no Supabase.
- Não houve criação de leads fictícios.
- A persistência real, actividade CRM, idempotência no banco e compatibilidade de schema permanecem pendentes.

## E. Testes

| Teste | Resultado | Evidência | Limitações |
|---|---|---|---|
| `pnpm install --frozen-lockfile` | PASS | Lockfile e dependências instalados | Nenhuma |
| `pnpm typecheck` | PASS | Shared, API e web concluídos | Nenhuma |
| `pnpm lint` | PASS | Sem warnings ou erros | Nenhuma |
| `pnpm build` | PASS | API compilada; `/academy` prerenderizada | Nenhuma |
| Teste unitário `validation.test.ts` | PASS | 21/21 testes | Não cobre Supabase real |
| Suite API completa | PENDENTE | Execução completa: 107/109 testes passaram; 2 ficheiros abortaram | `cost-abuse.test.ts` e `lead-service.test.ts` falharam antes dos testes por `supabaseUrl is required`; os 2 testes Academy adicionais passaram em execução isolada |
| `git diff --check` | PASS | Sem whitespace inválido | Nenhuma |
| PDFs com `pdfinfo` | PASS | Nove PDFs válidos | Nenhuma |
| ZIP com `unzip -t` | PASS | Pacote contém os nove PDFs esperados | Nenhuma |
| HTTP local `/academy` | PASS | HTTP 200; página renderizada | Apenas ambiente local |
| HTTP dos nove PDFs | PASS | HTTP 200 e `application/pdf` | Apenas ambiente local |
| Scan de segredos rastreados | PASS | Nenhum padrão de chave encontrado | Templates de nomes de variáveis são esperados |
| Submissão real Academy | PENDENTE | Não executada | Exigiria ambiente Supabase identificado/teste autorizado |
| Concorrência real por `request_id` | PENDENTE | Código corrigido atomicamente | Requer banco autorizado |
| Visual tablet/mobile | PENDENTE | Browser visual desktop realizado | Ferramenta disponível não permitiu alterar viewport desta aplicação local |

## F. CRM e notificações

- Leads Academy usam `source=academy`.
- `academy_course_id` identifica o curso quando aplicável.
- `request_id` garante idempotência por índice único e operação atómica.
- A actividade `lead_created` é criada apenas no pedido que efectivamente insere o lead.
- Rate limiting é reutilizado através do limiter público existente.
- A confirmação ao interessado comunica apenas recepção e análise; não promete vaga, aprovação, pagamento, início ou resultado financeiro.
- A notificação interna é best-effort e reutiliza o transporte existente.
- Nenhum email real foi enviado nesta auditoria.
- A regressão completa do diagnóstico não pôde ser executada porque os dois ficheiros referidos acima abortam na inicialização sem Supabase.

## G. Frontend e PDFs

- Rota `/academy`: verificada no browser sandbox.
- Navbar desktop: Academy visível.
- Conteúdo: oito formações, filtros, cartões, módulos e links PDF visíveis.
- Formulário: campos, consentimento, formação personalizada, estado de envio e mensagens de erro/sucesso implementados.
- SEO: título, descrição e `/academy` no sitemap.
- PDFs: oito documentos individuais e catálogo geral validados por integridade e HTTP.
- ZIP: mantido como artefacto secundário e não apresentado como nona formação.
- Validação visual desktop: realizada com screenshot/browser.
- Validação tablet/mobile: pendente; não é declarada como concluída.

## H. Segurança

Verificações realizadas:

- Validação server-side com Zod.
- Email, nome, mensagem, UUID, consentimento e campos desconhecidos tratados explicitamente.
- Rejeição de NUL byte antes da persistência.
- Mensagem limitada a 2.000 caracteres.
- Rate limiting público existente.
- Índice e upsert atómico para idempotência.
- Erros públicos não devolvem stack trace nem segredos.
- Nenhum endpoint público lista ou expõe leads.
- Nenhum segredo incluído no Git ou nos artefactos da implementação.
- Credenciais fornecidas não foram guardadas em ficheiro nem reproduzidas em documentação.

Risco pendente: não activar a rota em produção antes de aplicar e verificar a migração no ambiente correcto.

## I. Git e publicação

- Commit Academy existente: `256c082`.
- Correção de concorrência e testes adicionais ainda não estão commitados nesta auditoria.
- Push: **não realizado**.
- Branch remota `origin/feat/academy`: não existente no momento da auditoria.
- Não houve deploy de produção.
- Não houve alteração de `master`.

## J. Próximos passos

1. Disponibilizar as credenciais Supabase através de uma referência segura injectável no processo, ou identificar explicitamente um projeto de teste/staging.
2. Confirmar o ambiente por metadados seguros e aplicar `009_academy_requests.sql` apenas num ambiente de teste autorizado.
3. Executar a suite API completa com `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` disponíveis ao processo; validar cenários A–G sem criar dados em produção.
4. Fazer validação tablet/mobile através de uma ferramenta de screenshot com viewport configurável.
5. Commitar a correção de concorrência, os testes e este relatório; só depois reavaliar push para `origin/feat/academy`.
