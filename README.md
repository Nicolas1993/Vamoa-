# Vamoaê

*Nosso projeto para a matéria de PAM "Organizador de Viagens"* — grupo **ref's**.

## Como rodar

```bash
npm install
npx expo start
```

## O que já está pronto

- **Fase 1** ✅ — Tela de **Lista** (FlatList com viagens) e tela de **Detalhe** (busca a viagem pelo `id`), com navegação via `expo-router`.
- **Fase 2** ✅ — Tela **Adicionar** com formulário que **salva no AsyncStorage** (`lib/storage.js`). A lista recarrega ao voltar da tela de adicionar (`useFocusEffect`).
- Campos do tema: destino, período, pessoas, hospedagem, transporte e valor estimado.

## Tarefas que faltam (vocês completam)

Procure pelos comentários `// TAREFA (Aula XX):` no código:

1. **Aula 07** — Melhorar a validação do formulário (ex.: data no formato)`.
2. **Aula 18** — Botão **Editar** e **Excluir** na tela de detalhe (com confirmação via `Alert.alert`).
3. **Aula 14/15** — Migrar o armazenamento de **AsyncStorage para SQLite** (Fase 3). O `expo-sqlite` já está nas dependências.
4. **Aula 09** — (Opcional) usar `expo-location` para sugerir destinos próximos, se o tema fizer sentido.
5. **Aula 18** — Loading e empty state mais caprichados.

## Integrantes

- Nicolas de Oliveira Alves
- Melyssa de Oliveira Franco
- Pedro Henrique Leite de Souza