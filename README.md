# Portal do empreendedor (GEREST) — rascunho

Página de demonstração do formulário de abertura de processo para análise e aprovação de projetos de
infraestrutura (SEINFRA/GEREST, Prefeitura de Goiânia). **Aqui é demonstração:** enquanto a página
não conhece o endereço do serviço de recebimento, nada do que é preenchido ou anexado sai do navegador.

- `index.html` — a página (gerada; não editar à mão)
- `motor.js` — motor mínimo que desenha a página
- `fonte/Main.dc.html` — rascunho de origem, no formato do editor de design
- `montar.mjs` — gera o `index.html`: `node montar.mjs fonte/Main.dc.html [endereço do serviço de recebimento]`
- `teste.js` — conferência no navegador: inclua `<script src="teste.js"></script>` antes de `</body>`
  numa cópia do `index.html`, abra-a e leia o título da aba (cada item sai como OK ou FALHOU)
- `teste/` — ensaio de ponta a ponta com o serviço de recebimento (`sei_portal.py`, do Já SEI!) num navegador sem tela
