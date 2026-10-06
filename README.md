# Vamoaê

<!-- PAM-CI-NOTA-INICIO -->
### Nota atual (automática) — ref's (viagens)

[![CI](https://github.com/Nicolas1993/Vamoa-/actions/workflows/pam-ci.yml/badge.svg)](https://github.com/Nicolas1993/Vamoa-/actions/workflows/pam-ci.yml) [![Nota](https://img.shields.io/badge/Nota%20PAM%20I-R-orange)](https://github.com/Nicolas1993/Vamoa-/actions/workflows/pam-ci.yml)

**R** — Regular · **47%** (26/55 pontos) · atualizado em 2026-10-06 00:15

| Fase | Pontos |
|------|--------|
| Fase 1 — Estrutura | 9/10 |
| Fase 2 — AsyncStorage | 15/15 |
| Fase 3 — SQLite | 2/30 |

Checklist item a item em [NOTA.md](NOTA.md) · [ver a rodada mais recente no Actions](https://github.com/Nicolas1993/Vamoa-/actions/workflows/pam-ci.yml)
<!-- PAM-CI-NOTA-FIM -->

Organizador de viagens — grupo **ref's**.

> Aplicação atualizada com as **Fases 1 e 2** do Trabalho em Grupo: a lista de viagens agora é salva no **AsyncStorage** e dá para **adicionar** e **excluir** viagens pelo próprio app.

## Como rodar

```bash
npm install
npx expo start
```

## O que já está pronto

- **Fase 1** ✅ — Tela de **Lista** com cards estilo Airbnb (imagens), tela de **Detalhe** e tela de **Adicionar** (navegação por estado no `App.js`).
- **Fase 2** ✅ — Persistência em **AsyncStorage** (`lib/storage.js`) com dados iniciais em `data/viagens.js`. A lista carrega do banco ao abrir (`carregarViagens`).
- **CRUD parcial** — Criar (formulário), Ler (lista/detalhe) e **Excluir** (com confirmação).

## Tarefas que faltam (vocês completam)

Procure pelos comentários `// TAREFA (Aula XX):` no `App.js`:

1. **Aula 07** — Adicionar os campos qtdPessoas, hospedagem e transporte no formulário.
2. **Aula 18** — Botão **Editar** na tela de detalhe (Atualizar no AsyncStorage).
3. **Aula 14/15** — Migrar o armazenamento de AsyncStorage para **SQLite** na Fase 3 (`expo-sqlite`).

## Integrantes

- Nicolas de Oliveira Alves
- Melyssa de Oliveira Franco
- Pedro Henrique Leite de Souza