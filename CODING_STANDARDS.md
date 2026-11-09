# Padrões de Código e Convenções de Teste (CODING_STANDARDS.md)

## 1. Princípios de Design de Módulos (Deep Modules)
- **Módulos Profundos:** Interface pública enxuta e estável com implementação rica encapsulada. O `ChampionshipStore` concentra todas as regras de pontuação, cálculo de posições, autonomia de bateria, publicação de feed e controle de mutações/undo.
- **Costuras (Seams) e Adaptadores:** O acesso a armazenamento externo é isolado pela interface `StorageAdapter`, com implementações concretas `LocalStorageAdapter` (para runtime web) e `InMemoryAdapter` (para testes automatizados isolados).
- **Sem Dependências Cíclicas:** A camada de UI consome o domínio via hooks/contexto React; o domínio não conhece nada da UI nem do React.

## 2. Padrões de Código TypeScript e React
- **TypeScript Estrito:** Tipagem estrita ativada sem uso de `any`.
- **Componentes Funcionais:** Uso de hooks padrão do React (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Acessibilidade e Semântica:** Elementos HTML semânticos (`<nav>`, `<header>`, `<main>`, `<button>`), com atributos `aria-label`, `role` e contraste visual compatível com WCAG AA.
- **Dupla Codificação Semântica:** Toda sinalização de status ou criticidade deve combinar:
  1. Cor semântica (ex.: verde/amarelo/vermelho ou azul/roxo)
  2. Ícone reconhecível (ex.: ícones Lucide)
  3. Rótulo textual explícito (ex.: "Concluída", "Ao Vivo", "Agendada", "Ideal", "Atenção: Poupar", "Crítico: Trocar")

## 3. Convenções de Testes
- **Framework:** Vitest + React Testing Library + `@testing-library/jest-dom`.
- **Filosofia de Testes:** Testar comportamento através da costura pública, nunca detalhes de implementação privados.
- **Red-Green-Refactor:** Escrever teste primeiro em fatias verticais, implementar o mínimo para passar, refatorar mantendo a suíte verde.
- **Independência:** Cada teste de domínio ou UI deve inicializar um store isolado com `InMemoryAdapter`, garantindo ausência de estado compartilhado ou efeitos colaterais entre testes.
