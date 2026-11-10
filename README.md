# Portal do empreendedor (GEREST) — rascunho

Página de demonstração do formulário de abertura de processo para análise e aprovação de projetos de
infraestrutura (SEINFRA/GEREST, Prefeitura de Goiânia). **Protótipo sem envio real:** nada do que é
preenchido sai do navegador, e o botão "Anexar arquivo" só simula o anexo.

- `index.html` — a página (gerada; não editar à mão)
- `motor.js` — motor mínimo que desenha a página
- `fonte/Main.dc.html` — rascunho de origem, no formato do editor de design
- `montar.mjs` — gera o `index.html`: `node montar.mjs fonte/Main.dc.html`
- `teste.js` — conferência no navegador: inclua `<script src="teste.js"></script>` antes de `</body>`
  numa cópia do `index.html`, abra-a e leia o título da aba (cada item sai como OK ou FALHOU)
