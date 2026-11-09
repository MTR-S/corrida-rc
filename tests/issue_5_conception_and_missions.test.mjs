import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DOCS_DIR = path.resolve('docs');
const CONCEPTION_DOC = path.join(DOCS_DIR, 'documento_de_concepcao.md');
const MISSIONS_DOC = path.join(DOCS_DIR, 'missoes_de_usabilidade.md');
const PERSONAS_DOC = path.join(DOCS_DIR, 'personas_dupla_web_ihc.md');

test('Documento de Concepção - Existência e Persona 1 (Técnico Beto Almeida)', () => {
  assert.ok(fs.existsSync(CONCEPTION_DOC), 'documento_de_concepcao.md must exist');
  const content = fs.readFileSync(CONCEPTION_DOC, 'utf-8');

  // Verify Persona 1 identification and required sections
  assert.match(content, /Roberto\s+"Beto"\s+Almeida/i, 'Must contain Roberto "Beto" Almeida');
  assert.match(content, /T[ée]cnico\s+de\s+Equipe/i, 'Must identify role as Técnico de Equipe');
  assert.match(content, /Nitro\s+RC/i, 'Must associate Beto with Nitro RC');
  assert.match(content, /Perfil\s+Tecnol[oó]gico/i, 'Must have Perfil Tecnológico');
  assert.match(content, /Objetivos\s+e\s+Necessidades/i, 'Must have Objetivos e Necessidades');
  assert.match(content, /Dificuldades\s+e\s+Expectativas/i, 'Must have Dificuldades e Expectativas');
  assert.match(content, /Cen[aá]rio\s+de\s+Uso/i, 'Must have Cenário de Uso');
  assert.match(content, /4[ªa]\s+Prova/i, 'Cenário de uso must detail the 4th race (Prova 4)');
  assert.match(content, /Funcionalidades\s+Projetadas/i, 'Must detail Funcionalidades Projetadas');

  // Verify Catálogo de Informações Gerais de Pilotos e Equipes
  assert.match(content, /Cat[aá]logo/i, 'Must have Catálogo section');
  assert.match(content, /Nitro\s+RC/i, 'Must include Nitro RC in catalog');
  assert.match(content, /Apex\s+Racing/i, 'Must include Apex Racing in catalog');
  assert.match(content, /Turbo\s+Thunder/i, 'Must include Turbo Thunder in catalog');
  assert.match(content, /Velocity\s+Sport/i, 'Must include Velocity Sport in catalog');
  assert.match(content, /Vortex\s+Motorsport/i, 'Must include Vortex Motorsport in catalog');
  assert.match(content, /Cyber\s+Storm/i, 'Must include Cyber Storm in catalog');
  assert.match(content, /Lucas\s+Silveira/i, 'Must include Lucas Silveira');
  assert.match(content, /Bruno\s+Costa/i, 'Must include Bruno Costa');
});

test('Documento de Concepção - Fundamentação em Bastien & Scapin e Heurísticas de Nielsen', () => {
  const content = fs.readFileSync(CONCEPTION_DOC, 'utf-8');

  // Bastien & Scapin - 8 Criteria
  assert.match(content, /Condu[çc][ãa]o/i, 'Criterion 1: Condução');
  assert.match(content, /Presteza/i, 'Subcriterion: Presteza');
  assert.match(content, /Agrupamento/i, 'Subcriterion: Agrupamento/Distinção');
  assert.match(content, /Feedback\s+imediato/i, 'Subcriterion: Feedback Imediato');
  assert.match(content, /Legibilidade/i, 'Subcriterion: Legibilidade');

  assert.match(content, /Carga\s+de\s+trabalho/i, 'Criterion 2: Carga de Trabalho');
  assert.match(content, /Brevidade/i, 'Subcriterion: Brevidade');
  assert.match(content, /Densidade\s+informacional/i, 'Subcriterion: Densidade Informacional');

  assert.match(content, /Controle\s+expl[íi]cito/i, 'Criterion 3: Controle Explícito');
  assert.match(content, /Adaptabilidade/i, 'Criterion 4: Adaptabilidade');
  assert.match(content, /Gest[ãa]o\s+de\s+erros/i, 'Criterion 5: Gestão de Erros');
  assert.match(content, /Homogeneidade\s+e\s+coer[êe]ncia/i, 'Criterion 6: Homogeneidade e Coerência');
  assert.match(content, /Significado\s+dos\s+c[oó]digos/i, 'Criterion 7: Significado dos Códigos');
  assert.match(content, /Compatibilidade/i, 'Criterion 8: Compatibilidade');

  // Nielsen 10 Heuristics
  assert.match(content, /Visibilidade\s+do\s+estado\s+do\s+sistema/i, 'Heuristic 1');
  assert.match(content, /Correspond[êe]ncia\s+entre\s+o\s+sistema\s+e\s+o\s+mundo\s+real/i, 'Heuristic 2');
  assert.match(content, /Controle\s+e\s+liberdade\s+do\s+usu[áa]rio/i, 'Heuristic 3');
  assert.match(content, /Consist[êe]ncia\s+e\s+padr[õo]es/i, 'Heuristic 4');
  assert.match(content, /Preven[çc][ãa]o\s+de\s+erros/i, 'Heuristic 5');
  assert.match(content, /Reconhecimento\s+em\s+vez\s+de\s+memoriza[çc][ãa]o/i, 'Heuristic 6');
  assert.match(content, /Flexibilidade\s+e\s+efici[êe]ncia\s+de\s+uso/i, 'Heuristic 7');
  assert.match(content, /Design\s+est[ée]tico\s+e\s+minimalista/i, 'Heuristic 8');
  assert.match(content, /recuperar-se\s+de\s+erros/i, 'Heuristic 9');
  assert.match(content, /Ajuda\s+e\s+documenta[çc][ãa]o/i, 'Heuristic 10');

  // Key Frente 1 Interface decisions explicitly grounded
  assert.match(content, /Dashboard\s+Estrat[ée]gico/i, 'Decision: Dashboard Estratégico');
  assert.match(content, /Comparativo\s+de\s+Pilotos/i, 'Decision: Comparativo de Pilotos');
  assert.match(content, /Autonomia\s+da\s+Bateria/i, 'Decision: Monitor de Autonomia da Bateria');
  assert.match(content, /atalhos\s+de\s+teclado/i, 'Decision: Atalhos de Teclado');
  assert.match(content, /Pit\s+Lane/i, 'Decision: Tema Pit Lane');
  assert.match(content, /dupla\s+codifica[çc][ãa]o\s+sem[âa]ntica/i, 'Decision: Dupla Codificação Semântica');
});

test('Missões de Usabilidade 1 a 3 - Estrutura e Conteúdo', () => {
  assert.ok(fs.existsSync(MISSIONS_DOC), 'missoes_de_usabilidade.md must exist');
  const content = fs.readFileSync(MISSIONS_DOC, 'utf-8');

  // Missão 1
  assert.match(content, /Miss[ãa]o\s+1/i, 'Must contain Missão 1');
  assert.match(content, /Miss[ãa]o\s+2/i, 'Must contain Missão 2');
  assert.match(content, /Miss[ãa]o\s+3/i, 'Must contain Missão 3');

  // Required sections in all 3 missions
  const mission1Match = content.match(/###\s+Miss[ãa]o\s+(?:de\s+Usabilidade\s+)?1[\s\S]*?(?=###\s+Miss[ãa]o\s+(?:de\s+Usabilidade\s+)?2)/i);
  const mission2Match = content.match(/###\s+Miss[ãa]o\s+(?:de\s+Usabilidade\s+)?2[\s\S]*?(?=###\s+Miss[ãa]o\s+(?:de\s+Usabilidade\s+)?3)/i);
  const mission3Match = content.match(/###\s+Miss[ãa]o\s+(?:de\s+Usabilidade\s+)?3[\s\S]*?(?=##\s+3|$)/i);

  assert.ok(mission1Match, 'Missão 1 section found');
  assert.ok(mission2Match, 'Missão 2 section found');
  assert.ok(mission3Match, 'Missão 3 section found');

  for (const [idx, mText] of [[1, mission1Match[0]], [2, mission2Match[0]], [3, mission3Match[0]]]) {
    assert.match(mText, /Persona/i, `Missão ${idx} must state Persona`);
    assert.match(mText, /Contexto/i, `Missão ${idx} must state Contexto`);
    assert.match(mText, /Objetivo/i, `Missão ${idx} must state Objetivo`);
    assert.match(mText, /Crit[ée]rio\s+de\s+Sucesso/i, `Missão ${idx} must state Critério de Sucesso`);
    assert.match(mText, /Gabarito/i, `Missão ${idx} must contain deterministic Gabarito`);
  }

  // Check specific mission topics & gabarito values
  // Mission 1: Lap comparison
  assert.match(mission1Match[0], /Bruno\s+Costa/i, 'Mission 1 gabarito mentions Bruno Costa');
  assert.match(mission1Match[0], /18\.240/i, 'Mission 1 gabarito mentions 18.240s');

  // Mission 2: Battery autonomy
  assert.match(mission2Match[0], /14\s+voltas/i, 'Mission 2 gabarito mentions 14 voltas');
  assert.match(mission2Match[0], /Aten[çc][ãa]o/i, 'Mission 2 gabarito mentions Atenção status');

  // Mission 3: Position, rhythm, and team score sum
  assert.match(mission3Match[0], /24\s+pontos/i, 'Mission 3 gabarito mentions 24 pontos acumulados');
  assert.match(mission3Match[0], /4\s+pontos/i, 'Mission 3 gabarito mentions 4 pontos projetados');
});

test('Missões de Usabilidade 1 a 3 - Nenhuma instrução de navegação ou controle', () => {
  const content = fs.readFileSync(MISSIONS_DOC, 'utf-8');

  // Extract text of Section 2 (Missions 1 to 3)
  const m1To3 = content.match(/##\s+2\.\s+Miss[õo]es[\s\S]*?(?=##\s+3\.)/i);
  assert.ok(m1To3, 'Extracted missions 1 to 3');
  const missionsText = m1To3[0];

  // Forbidden instructional patterns that tell user how to navigate or click buttons/menus
  const forbiddenPatterns = [
    /\bclique\b/i,
    /\bclicar\b/i,
    /\bbot[ãa]o\b/i,
    /\bbot[õo]es\b/i,
    /\babas?\b/i,
    /\bmenus?\b/i,
    /\bpressione\b/i,
    /\bnavegue\b/i,
    /\bdropdown\b/i,
    /\bbarra\s+lateral\b/i,
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(
      missionsText,
      pattern,
      `Missions 1 to 3 must not instruct how to navigate: matched ${pattern}`
    );
  }
});

test('Alinhamento com docs/personas_dupla_web_ihc.md', () => {
  assert.ok(fs.existsSync(PERSONAS_DOC), 'personas_dupla_web_ihc.md must exist');
  const content = fs.readFileSync(PERSONAS_DOC, 'utf-8');

  assert.match(content, /Roberto\s+"Beto"\s+Almeida/i, 'Must contain Beto Almeida');
  assert.match(content, /Cat[aá]logo/i, 'Must contain Catálogo');
  assert.match(content, /Bastien/i, 'Must contain Bastien e Scapin reference');
  assert.match(content, /Nielsen/i, 'Must contain Nielsen reference');
});
